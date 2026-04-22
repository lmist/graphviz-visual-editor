#!/usr/bin/env node

import http from 'node:http';
import os from 'node:os';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import DotGraph from './src/dot.js';

const PORT = Number(process.env.GRAPHVIZ_RPC_PORT || 3001);
const HOST = process.env.GRAPHVIZ_RPC_HOST || '127.0.0.1';
const STATE_FILE = process.env.GRAPHVIZ_STATE_FILE || resolve(os.tmpdir(), 'graphviz-visual-editor', 'state.json');

const state = {
  dot: 'strict digraph {\n}\n',
  revision: 0,
  updatedAt: new Date().toISOString(),
  source: 'startup',
};

const clients = new Set();

function summarize(dot) {
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
  return `${strict ? 'strict ' : ''}${type} ${quotedName} {\n}`;
}

function normalizeDot(dot) {
  const graph = new DotGraph(dot);
  return graph.toString();
}

async function loadState() {
  try {
    const text = await readFile(STATE_FILE, 'utf8');
    const data = JSON.parse(text);
    if (typeof data.dot === 'string' && data.dot.trim()) {
      state.dot = normalizeDot(data.dot);
      state.revision = Number(data.revision) || 0;
      state.updatedAt = data.updatedAt || new Date().toISOString();
      state.source = data.source || 'disk';
    }
  } catch {
    // No persisted state yet.
  }
}

async function saveState() {
  await mkdir(dirname(STATE_FILE), { recursive: true });
  await writeFile(
    STATE_FILE,
    JSON.stringify(
      {
        dot: state.dot,
        revision: state.revision,
        updatedAt: state.updatedAt,
        source: state.source,
      },
      null,
      2,
    ),
    'utf8',
  );
}

function getSnapshot() {
  return {
    dot: state.dot,
    summary: summarize(state.dot),
    revision: state.revision,
    updatedAt: state.updatedAt,
    source: state.source,
    stateFile: STATE_FILE,
  };
}

function broadcast() {
  const payload = `event: state\ndata: ${JSON.stringify(getSnapshot())}\n\n`;
  for (const res of clients) {
    res.write(payload);
  }
}

async function commitDot(dot, source) {
  const normalizedDot = normalizeDot(dot);
  if (normalizedDot === state.dot) {
    return getSnapshot();
  }
  state.dot = normalizedDot;
  state.revision += 1;
  state.updatedAt = new Date().toISOString();
  state.source = source;
  await saveState();
  broadcast();
  return getSnapshot();
}

async function rpc(method, params = {}) {
  switch (method) {
    case 'getState':
      return getSnapshot();
    case 'setDot':
      return commitDot(params.dot, 'setDot');
    case 'newGraph':
      return commitDot(createGraph(params), 'newGraph');
    case 'addNode': {
      const graph = new DotGraph(state.dot);
      graph.insertNode(params.id, params.attrs || {});
      graph.reparse();
      return commitDot(graph.toString(), 'addNode');
    }
    case 'addEdge': {
      const graph = new DotGraph(state.dot);
      const edgeop = params.directed == null ? graph.edgeop : params.directed ? '->' : '--';
      graph.insertEdge(params.from, params.to, edgeop, params.attrs || {});
      graph.reparse();
      return commitDot(graph.toString(), 'addEdge');
    }
    case 'deleteNode': {
      const graph = new DotGraph(state.dot);
      graph.deleteNode(params.id);
      graph.reparse();
      return commitDot(graph.toString(), 'deleteNode');
    }
    case 'deleteEdge': {
      const graph = new DotGraph(state.dot);
      graph.deleteEdge(params.edgeId);
      graph.reparse();
      return commitDot(graph.toString(), 'deleteEdge');
    }
    default:
      throw new Error(`Unknown RPC method: ${method}`);
  }
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

function sendSseHeaders(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.write(`event: state\ndata: ${JSON.stringify(getSnapshot())}\n\n`);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }

    if (req.method === 'GET' && req.url === '/health') {
      sendJson(res, 200, { ok: true, ...getSnapshot() });
      return;
    }

    if (req.method === 'GET' && req.url === '/state') {
      sendJson(res, 200, getSnapshot());
      return;
    }

    if (req.method === 'GET' && req.url === '/events') {
      sendSseHeaders(res);
      clients.add(res);
      req.on('close', () => {
        clients.delete(res);
      });
      req.on('aborted', () => {
        clients.delete(res);
      });
      return;
    }

    if (req.method === 'POST' && req.url === '/rpc') {
      const body = await readBody(req);
      const method = body.method;
      const params = body.params || {};
      const id = body.id ?? null;
      try {
        const result = await rpc(method, params);
        sendJson(res, 200, { jsonrpc: '2.0', result, id });
      } catch (error) {
        sendJson(res, 200, {
          jsonrpc: '2.0',
          error: { code: -32601, message: error.message || 'RPC error' },
          id,
        });
      }
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (error) {
    sendJson(res, 500, { error: error.message || String(error) });
  }
});

await loadState();

server.listen(PORT, HOST, () => {
  console.log(`Graphviz RPC backend listening on http://${HOST}:${PORT}`);
  console.log(`State file: ${STATE_FILE}`);
});
