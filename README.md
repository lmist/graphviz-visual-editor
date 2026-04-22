# graphviz-visual-editor

Try it at http://magjac.com/graphviz-visual-editor.

A web application for interactive visual editing of [Graphviz](http://www.graphviz.org) graphs described in the [DOT](https://www.graphviz.org/doc/info/lang.html) language.

[![CircleCI](https://circleci.com/gh/magjac/graphviz-visual-editor.svg?style=svg)](https://circleci.com/gh/magjac/graphviz-visual-editor)
[![codecov](https://codecov.io/gh/magjac/graphviz-visual-editor/branch/master/graph/badge.svg)](https://codecov.io/gh/magjac/graphviz-visual-editor)

## Installation ##

```
git clone https://github.com/magjac/graphviz-visual-editor
cd graphviz-visual-editor
npm install
make
npm run start
```

**NOTE:** The *make* stage emits a few warnings. Ignore them.

To create an optimized build of the application:

```
npm run build
```

## Backend RPC + Live Sync ##

This repo can run with a local backend RPC service that keeps the graph state in sync with the editor.
The backend does **not** open a browser.

Run the backend in one terminal:

```
npm run backend
```

Then run the editor in another terminal:

```
npm run start
```

By default the editor connects to `http://127.0.0.1:3001`.
You can override that with `REACT_APP_GRAPHVIZ_RPC_URL`.

The backend exposes JSON-RPC methods for:

- `getState`
- `setDot`
- `newGraph`
- `addNode`
- `addEdge`
- `deleteNode`
- `deleteEdge`

It also publishes live change events over Server-Sent Events at `/events`, so any open editor tab can stay synchronized.

## MCP Server ##

This repo also includes a local [MCP](https://modelcontextprotocol.io) server that **attaches to an already-running Graphviz Visual Editor tab**.
It does **not** launch a browser.

Run it with:

```
npm run mcp
```

By default it scans common local Chrome DevTools ports and looks for a tab whose URL matches the Graphviz Visual Editor.
You can override detection with environment variables:

- `GRAPHVIZ_CDP_URL` — explicit Chrome DevTools websocket URL
- `GRAPHVIZ_CDP_PORTS` — comma-separated list of local DevTools ports to scan
- `GRAPHVIZ_TARGET_URL` — substring to match against the page URL
- `GRAPHVIZ_TARGET_PATTERN` — comma-separated regular expressions used to match page URLs

The server exposes tools for attaching to an existing instance, reading/writing DOT, adding/removing nodes and edges, and reading live SVG output.
It also publishes these resources:

- `graphviz://connection`
- `graphviz://current/dot`
- `graphviz://current/svg`
- `graphviz://current/summary`

Learn more from the Create React App [README](https://github.com/facebook/create-react-app#npm-run-build-or-yarn-build) and [User Guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment).

## Implemented Features ##

* Rendering of a graph from a textual [DOT](https://www.graphviz.org/doc/info/lang.html) representation.
* Panning and zooming the graph.
* Editing the DOT source in a context sensitive text editor.
* Visual editing of the graph through mouse interactions:
  * Insert node shapes by click or drag-and-drop.
  * Select default node style, color and fillcolor.
  * Draw edges between nodes.
  * Select nodes and edges by click or by area drag and mark them in the text editor.
  * Delete selected nodes and edges.
  * Cut/Copy-and-paste a selected node.
* Automatic update of the DOT source when the graph is visually edited.
* Automatic update of the graph when the DOT source is edited.
* Animated transition of the graph into a new state when changes are made.
* Preservation of the DOT source and the application state during page reloads by automatic save and retrieve to/from local storage in the browser.
* Export graph as URL and import graph from such an URL.
* Export graph as SVG.
* Options:
  * Automatically fit the graph to the available drawing area.
  * Select Graphviz layout engine.
* On-line help:
  * Keyboard shortcuts
  * Mouse interactions

## Tested Browsers ##

* Firefox 71
* Chrome 79

## Known Issues ##

Known issues are **not listed here**.

All known bugs and enhancement requests are reported as issues on [GitHub](https://github.com/magjac/graphviz-visual-editor) and are listed under the [Issues](https://github.com/magjac/graphviz-visual-editor/issues) tab.

### [All open issues](https://github.com/magjac/graphviz-visual-editor/issues) ###

Lists both bugs and enhancement requests.

### [Known open bugs](https://github.com/magjac/graphviz-visual-editor/labels/bug) ###

### [Open enhancement requests](https://github.com/magjac/graphviz-visual-editor/labels/enhancement) ###

### [Known limitations](https://github.com/magjac/graphviz-visual-editor/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Abug+label%3Aenhancement) ###

A limitation is a feature deliberately released without full functionality. A limitation is classifed both as a bug and as an enhancement request to reflect that although it's an enhancement not yet implemented from the author's perspective, it might be perceived as a bug from the user's perspective.

### [Closed issues](https://github.com/magjac/graphviz-visual-editor/issues?q=is%3Aissue+is%3Aclosed) ###

## Roadmap ##

There are numerous cool features missing. They are or will be listed as [enhancement requests](https://github.com/magjac/graphviz-visual-editor/labels/enhancement) on [GitHub](https://github.com/magjac/graphviz-visual-editor).

There is also a [project board](https://github.com/magjac/graphviz-visual-editor/projects/1) showing the short-term activities.
