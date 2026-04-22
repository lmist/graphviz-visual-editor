#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const BACKEND_URL = (process.env.GRAPHVIZ_RPC_URL || 'http://127.0.0.1:3001').replace(/\/$/, '');

const server = new McpServer(
  { name: 'graphviz-visual-editor-mcp', version: '1.0.0' },
  {
    instructions:
      'This MCP server controls the Graphviz Visual Editor through the backend RPC service. ' +
      'It does not launch a browser and it does not talk to Chrome directly.',
  },
);

async function backendRequest(path, body) {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`Backend HTTP ${response.status} on ${path}`);
  }
  return response.json();
}

async function backendRpc(method, params = {}) {
  const result = await backendRequest('/rpc', {
    jsonrpc: '2.0',
    method,
    params,
    id: Date.now(),
  });
  if (result.error) {
    throw new Error(result.error.message || 'Backend RPC failed');
  }
  return result.result;
}

async function getState() {
  return backendRequest('/state');
}

function stateSummarySchema() {
  return z.object({
    directed: z.boolean(),
    nodeCount: z.number(),
    edgeCount: z.number(),
    nodeIds: z.array(z.string()),
    edgeIds: z.array(z.string()),
  });
}

server.registerResource(
  'backend-state',
  'graphviz://backend/state',
  {
    title: 'Backend graph state',
    description: 'Full backend state for the Graphviz editor',
    mimeType: 'application/json',
  },
  async () => {
    const state = await getState();
    return {
      contents: [
        {
          uri: 'graphviz://backend/state',
          mimeType: 'application/json',
          text: JSON.stringify(state, null, 2),
        },
      ],
    };
  },
);

server.registerResource(
  'backend-dot',
  'graphviz://backend/dot',
  {
    title: 'Backend DOT',
    description: 'Current DOT source from the backend',
    mimeType: 'text/plain',
  },
  async () => {
    const state = await getState();
    return {
      contents: [
        {
          uri: 'graphviz://backend/dot',
          mimeType: 'text/plain',
          text: state.dot,
        },
      ],
    };
  },
);

server.registerResource(
  'backend-summary',
  'graphviz://backend/summary',
  {
    title: 'Backend graph summary',
    description: 'Summary of the current graph state',
    mimeType: 'application/json',
  },
  async () => {
    const state = await getState();
    return {
      contents: [
        {
          uri: 'graphviz://backend/summary',
          mimeType: 'application/json',
          text: JSON.stringify(state.summary, null, 2),
        },
      ],
    };
  },
);

const summaryOut = stateSummarySchema();

server.registerTool(
  'get_state',
  {
    title: 'Get backend state',
    description: 'Read the full backend state',
    inputSchema: {},
    outputSchema: {
      dot: z.string(),
      summary: summaryOut,
      revision: z.number(),
      updatedAt: z.string(),
      source: z.string(),
      stateFile: z.string(),
    },
  },
  async () => {
    const state = await getState();
    return {
      content: [{ type: 'text', text: JSON.stringify(state, null, 2) }],
      structuredContent: state,
    };
  },
);

server.registerTool(
  'set_dot',
  {
    title: 'Set DOT',
    description: 'Replace the backend graph with a DOT string',
    inputSchema: {
      dot: z.string().min(1),
    },
    outputSchema: {
      dot: z.string(),
      summary: summaryOut,
      revision: z.number(),
      updatedAt: z.string(),
      source: z.string(),
      stateFile: z.string(),
    },
  },
  async ({ dot }) => {
    const result = await backendRpc('setDot', { dot });
    return {
      content: [{ type: 'text', text: 'DOT updated in backend.' }],
      structuredContent: result,
    };
  },
);

server.registerTool(
  'new_graph',
  {
    title: 'Create graph',
    description: 'Create a new graph in the backend',
    inputSchema: {
      directed: z.boolean().default(true),
      strict: z.boolean().default(false),
      name: z.string().default('G'),
    },
    outputSchema: {
      dot: z.string(),
      summary: summaryOut,
      revision: z.number(),
      updatedAt: z.string(),
      source: z.string(),
      stateFile: z.string(),
    },
  },
  async ({ directed = true, strict = false, name = 'G' }) => {
    const result = await backendRpc('newGraph', { directed, strict, name });
    return {
      content: [{ type: 'text', text: 'Created a new graph in backend.' }],
      structuredContent: result,
    };
  },
);

server.registerTool(
  'add_node',
  {
    title: 'Add node',
    description: 'Add a node to the backend graph',
    inputSchema: {
      id: z.string().min(1),
      attrs: z.record(z.string(), z.string()).default({}),
    },
    outputSchema: {
      dot: z.string(),
      summary: summaryOut,
      revision: z.number(),
      updatedAt: z.string(),
      source: z.string(),
      stateFile: z.string(),
    },
  },
  async ({ id, attrs = {} }) => {
    const result = await backendRpc('addNode', { id, attrs });
    return {
      content: [{ type: 'text', text: `Added node ${id}.` }],
      structuredContent: result,
    };
  },
);

server.registerTool(
  'add_edge',
  {
    title: 'Add edge',
    description: 'Add an edge to the backend graph',
    inputSchema: {
      from: z.string().min(1),
      to: z.string().min(1),
      attrs: z.record(z.string(), z.string()).default({}),
      directed: z.boolean().optional(),
    },
    outputSchema: {
      dot: z.string(),
      summary: summaryOut,
      revision: z.number(),
      updatedAt: z.string(),
      source: z.string(),
      stateFile: z.string(),
    },
  },
  async ({ from, to, attrs = {}, directed }) => {
    const result = await backendRpc('addEdge', { from, to, attrs, directed });
    return {
      content: [{ type: 'text', text: `Added edge ${from} -> ${to}.` }],
      structuredContent: result,
    };
  },
);

server.registerTool(
  'delete_node',
  {
    title: 'Delete node',
    description: 'Delete a node from the backend graph',
    inputSchema: {
      id: z.string().min(1),
    },
    outputSchema: {
      dot: z.string(),
      summary: summaryOut,
      revision: z.number(),
      updatedAt: z.string(),
      source: z.string(),
      stateFile: z.string(),
    },
  },
  async ({ id }) => {
    const result = await backendRpc('deleteNode', { id });
    return {
      content: [{ type: 'text', text: `Deleted node ${id}.` }],
      structuredContent: result,
    };
  },
);

server.registerTool(
  'delete_edge',
  {
    title: 'Delete edge',
    description: 'Delete an edge from the backend graph',
    inputSchema: {
      edgeId: z.string().min(1),
    },
    outputSchema: {
      dot: z.string(),
      summary: summaryOut,
      revision: z.number(),
      updatedAt: z.string(),
      source: z.string(),
      stateFile: z.string(),
    },
  },
  async ({ edgeId }) => {
    const result = await backendRpc('deleteEdge', { edgeId });
    return {
      content: [{ type: 'text', text: `Deleted edge ${edgeId}.` }],
      structuredContent: result,
    };
  },
);

async function main() {
  const health = await getState();
  console.error(`Connected to backend RPC at ${BACKEND_URL}`);
  console.error(`Current revision: ${health.revision}`);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
