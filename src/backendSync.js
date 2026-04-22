const DEFAULT_BACKEND_URL =
  typeof process !== 'undefined' && process.env.REACT_APP_GRAPHVIZ_RPC_URL
    ? process.env.REACT_APP_GRAPHVIZ_RPC_URL
    : 'http://127.0.0.1:3001';

function getBaseUrl() {
  return DEFAULT_BACKEND_URL.replace(/\/$/, '');
}

async function request(path, options = {}) {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function backendHealth() {
  return request('/health');
}

export async function backendGetState() {
  return request('/state');
}

export async function backendRpc(method, params = {}) {
  const result = await request('/rpc', {
    method: 'POST',
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: Date.now() }),
  });

  if (result.error) {
    throw new Error(result.error.message || 'RPC error');
  }

  return result.result;
}

export function backendSubscribe(onState, onError) {
  const eventSource = new EventSource(`${getBaseUrl()}/events`);
  eventSource.addEventListener('state', (event) => {
    try {
      onState(JSON.parse(event.data));
    } catch (error) {
      onError?.(error);
    }
  });
  eventSource.onerror = (error) => {
    onError?.(error instanceof Error ? error : new Error('Backend event stream error'));
  };
  return () => eventSource.close();
}
