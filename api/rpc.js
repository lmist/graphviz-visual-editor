import { commitDot, createGraph, getCurrentState, mutateState } from './_graph-state.js';

function sendJson(res, status, body) {
  res.status(status).setHeader('Access-Control-Allow-Origin', '*');
  res.json(body);
}

async function rpc(method, params = {}) {
  switch (method) {
    case 'getState':
      return getCurrentState();
    case 'setDot':
      return commitDot(params.dot, 'setDot');
    case 'newGraph':
      return commitDot(createGraph(params), 'newGraph');
    case 'addNode':
      return mutateState((graph) => graph.insertNode(params.id, params.attrs || {}), 'addNode');
    case 'addEdge':
      return mutateState((graph) => {
        const edgeop = params.directed == null ? graph.edgeop : params.directed ? '->' : '--';
        graph.insertEdge(params.from, params.to, edgeop, params.attrs || {});
      }, 'addEdge');
    case 'deleteNode':
      return mutateState((graph) => graph.deleteNode(params.id), 'deleteNode');
    case 'deleteEdge':
      return mutateState((graph) => graph.deleteEdge(params.edgeId), 'deleteEdge');
    default:
      throw new Error(`Unknown RPC method: ${method}`);
  }
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const state = await getCurrentState();
      sendJson(res, 200, { ok: true, ...state });
      return;
    }

    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Method not allowed' });
      return;
    }

    const { method, params = {}, id = null } = req.body || {};
    const result = await rpc(method, params);
    sendJson(res, 200, { jsonrpc: '2.0', result, id });
  } catch (error) {
    sendJson(res, 200, {
      jsonrpc: '2.0',
      error: { code: -32603, message: error.message || 'RPC error' },
      id: req.body?.id ?? null,
    });
  }
}
