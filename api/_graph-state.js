import { Graphviz } from '@hpcc-js/wasm/graphviz';

import DotGraph from '../src/dot.js';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GIST_ID = process.env.GRAPHVIZ_GIST_ID;
const GIST_FILE = process.env.GRAPHVIZ_GIST_FILE || 'graphviz-state.json';
const GITHUB_API = 'https://api.github.com';

let graphvizPromise = null;
let memoryState = null;

function initialDot() {
  return 'digraph G {}';
}

function normalizeDot(dot) {
  const graph = new DotGraph(dot);
  return graph.toString();
}

function summarizeDot(dot) {
  const graph = new DotGraph(dot);
  const nodeIds = Object.keys(graph.nodes).sort();
  const edgeIds = Object.keys(graph.edges).sort();
  return {
    directed: graph.edgeop === '->',
    nodeCount: nodeIds.length,
    edgeCount: edgeIds.length,
    nodeIds,
    edgeIds,
  };
}

function createGraph({ directed = true, strict = false, name = 'G' } = {}) {
  const type = directed ? 'digraph' : 'graph';
  const quotedName = /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) ? name : JSON.stringify(name);
  return `${strict ? 'strict ' : ''}${type} ${quotedName} {}`;
}

async function ensureGraphviz() {
  if (!graphvizPromise) {
    graphvizPromise = Graphviz.load();
  }
  return graphvizPromise;
}

async function renderSvg(dot) {
  const graphviz = await ensureGraphviz();
  return graphviz.layout(dot, 'svg', 'dot');
}

async function githubRequest(path, options = {}) {
  if (!GITHUB_TOKEN) {
    throw new Error('Missing GITHUB_TOKEN');
  }
  const response = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status}: ${text}`);
  }
  return response;
}

async function loadState() {
  if (!GIST_ID) {
    if (!memoryState) {
      const dot = initialDot();
      memoryState = {
        dot,
        svg: await renderSvg(dot),
        summary: summarizeDot(dot),
        revision: 0,
        updatedAt: new Date().toISOString(),
        source: 'startup',
        statePath: 'memory',
      };
    }
    return memoryState;
  }

  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  const response = await fetch(`${GITHUB_API}/gists/${GIST_ID}`, { headers });
  if (!response.ok) {
    const dot = initialDot();
    return {
      dot,
      svg: await renderSvg(dot),
      summary: summarizeDot(dot),
      revision: 0,
      updatedAt: new Date().toISOString(),
      source: 'startup',
      statePath: `gist:${GIST_ID}`,
    };
  }

  const data = await response.json();
  const file = data.files?.[GIST_FILE] || Object.values(data.files || {})[0];
  const text = file?.content || '';
  const parsed = text ? JSON.parse(text) : {};
  const dot = typeof parsed.dot === 'string' ? normalizeDot(parsed.dot) : initialDot();
  const svg = typeof parsed.svg === 'string' && parsed.svg ? parsed.svg : await renderSvg(dot);
  return {
    dot,
    svg,
    summary: parsed.summary || summarizeDot(dot),
    revision: Number(parsed.revision) || 0,
    updatedAt: parsed.updatedAt || new Date().toISOString(),
    source: parsed.source || 'gist',
    statePath: `gist:${GIST_ID}/${String(file?.filename || GIST_FILE).trim()}`,
  };
}

async function saveState(state) {
  const payload = JSON.stringify(
    {
      dot: state.dot,
      svg: state.svg,
      summary: state.summary,
      revision: state.revision,
      updatedAt: state.updatedAt,
      source: state.source,
      statePath: state.statePath,
    },
    null,
    2,
  );

  if (!GIST_ID) {
    memoryState = state;
    return;
  }

  await githubRequest(`/gists/${GIST_ID}`, {
    method: 'PATCH',
    body: JSON.stringify({
      files: {
        [GIST_FILE]: { content: payload },
      },
    }),
  });
}

async function getCurrentState() {
  return loadState();
}

async function commitDot(dot, source = 'setDot') {
  const current = await loadState();
  const normalizedDot = normalizeDot(dot);
  const svg = await renderSvg(normalizedDot);
  const summary = summarizeDot(normalizedDot);
  const next = {
    ...current,
    dot: normalizedDot,
    svg,
    summary,
    revision: current.revision + 1,
    updatedAt: new Date().toISOString(),
    source,
  };
  await saveState(next);
  return next;
}

async function mutateState(mutator, source) {
  const current = await loadState();
  const graph = new DotGraph(current.dot);
  mutator(graph);
  graph.reparse();
  return commitDot(graph.toString(), source);
}

export {
  createGraph,
  getCurrentState,
  commitDot,
  mutateState,
  summarizeDot,
  normalizeDot,
  renderSvg,
};
