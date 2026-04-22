#!/usr/bin/env node

import { createReadStream, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, normalize, relative, resolve } from 'node:path';
import http from 'node:http';

import { commitDot, createGraph, getCurrentState, mutateState } from './api/_graph-state.js';

const PORT = Number(process.env.PORT || 3000);
const BUILD_DIR = resolve('build');
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

const sseClients = new Set();

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

function broadcastState(state) {
  const payload = `event: state\ndata: ${JSON.stringify(state)}\n\n`;
  for (const res of sseClients) {
    res.write(payload);
  }
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

async function rpc(method, params = {}) {
  switch (method) {
    case 'getState':
      return getCurrentState();
    case 'setDot': {
      const result = await commitDot(params.dot, 'setDot');
      broadcastState(result);
      return result;
    }
    case 'newGraph': {
      const result = await commitDot(createGraph(params), 'newGraph');
      broadcastState(result);
      return result;
    }
    case 'addNode': {
      const result = await mutateState((graph) => graph.insertNode(params.id, params.attrs || {}), 'addNode');
      broadcastState(result);
      return result;
    }
    case 'addEdge': {
      const result = await mutateState((graph) => {
        const edgeop = params.directed == null ? graph.edgeop : params.directed ? '->' : '--';
        graph.insertEdge(params.from, params.to, edgeop, params.attrs || {});
      }, 'addEdge');
      broadcastState(result);
      return result;
    }
    case 'deleteNode': {
      const result = await mutateState((graph) => graph.deleteNode(params.id), 'deleteNode');
      broadcastState(result);
      return result;
    }
    case 'deleteEdge': {
      const result = await mutateState((graph) => graph.deleteEdge(params.edgeId), 'deleteEdge');
      broadcastState(result);
      return result;
    }
    default:
      throw new Error(`Unknown RPC method: ${method}`);
  }
}

function serveStatic(res, filePath) {
  const ext = extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  createReadStream(filePath).pipe(res);
}

function isInsideBuildDir(filePath) {
  const relativePath = relative(BUILD_DIR, filePath);
  return relativePath && !relativePath.startsWith('..') && !relativePath.startsWith('/');
}

async function serveAppShell(res) {
  const indexHtml = resolve(BUILD_DIR, 'index.html');
  const html = await readFile(indexHtml, 'utf8');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }

    if (pathname === '/health') {
      const state = await getCurrentState();
      sendJson(res, 200, { ok: true, ...state });
      return;
    }

    if (pathname === '/state') {
      sendJson(res, 200, await getCurrentState());
      return;
    }

    if (pathname === '/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      const state = await getCurrentState();
      res.write(`event: state\ndata: ${JSON.stringify(state)}\n\n`);
      sseClients.add(res);
      req.on('close', () => sseClients.delete(res));
      req.on('aborted', () => sseClients.delete(res));
      return;
    }

    if (pathname === '/rpc' && req.method === 'POST') {
      const body = await readBody(req);
      const result = await rpc(body.method, body.params || {});
      sendJson(res, 200, { jsonrpc: '2.0', result, id: body.id ?? null });
      return;
    }

    // Static assets
    const assetPath = pathname === '/' ? resolve(BUILD_DIR, 'index.html') : resolve(BUILD_DIR, normalize(`.${pathname}`));
    if (isInsideBuildDir(assetPath) && existsSync(assetPath) && !assetPath.endsWith('/')) {
      serveStatic(res, assetPath);
      return;
    }

    // SPA fallback
    await serveAppShell(res);
  } catch (error) {
    sendJson(res, 500, { error: error.message || String(error) });
  }
});

server.listen(PORT, () => {
  console.log(`Railway webapp listening on port ${PORT}`);
});
