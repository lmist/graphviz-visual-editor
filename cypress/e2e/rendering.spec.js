function getAllPropertyNames(obj) {
  const proto     = Object.getPrototypeOf(obj);
  const inherited = (proto) ? getAllPropertyNames(proto) : [];
  return [...new Set(Object.getOwnPropertyNames(obj).concat(inherited))];
}

describe('Basic rendering from DOT source', function() {

  it('Selects the current DOT source, clears it, enters a simple graph and checks that it renders', function() {
    cy.startApplication();
    cy.checkDefaultGraph();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.textEditorContent().should('have.text', 'digraph {Alice -> Bob}');

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findNodes().should('have.length', 2);
      cy.wrap(graph0).findNode(1)
        .should('exist')
        .shouldHaveLabel('Alice');
      cy.wrap(graph0).findNode(2)
        .should('exist')
        .shouldHaveLabel('Bob');
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob');
    });
  })

  it('Starts by rendering an empty graph stored in browser local storage', function() {
    localStorage.setItem('dotSrc', 'digraph {}');
    cy.visit('/');

    cy.textEditorContent().should('have.text', 'digraph {}');

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findNodes().should('have.length', 0);
    });
  })

  it('Renders DOT source using the engine selected in settings', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    const engines = [
      'circo',
      'dot',
      'fdp',
      'neato',
      'osage',
      'patchwork',
      'twopi',
    ];

    engines.forEach(engine => {
      cy.settingsButton().click();
      cy.engineSelector().click();
      cy.engineMenuAlternative(engine).click();
      cy.get('body').type('{esc}', { release: false });
      cy.waitForTransition();
      cy.canvasGraph().then(graph0 => {
        switch (engine) {
        case 'circo':
          cy.wrap(graph0).invoke('height').should('be.closeTo', 58.667, 0.0005);
          cy.wrap(graph0).invoke('width').should('be.closeTo', 264.227, 0.0005);
          break;
        case 'dot':
          cy.wrap(graph0).invoke('height').should('be.closeTo', 154.667, 0.0005);
          cy.wrap(graph0).invoke('width').should('be.closeTo', 95.867, 0.0005);
          break;
        case 'fdp':
          cy.wrap(graph0).invoke('height').should('be.closeTo', 72.907, 0.0005);
          cy.wrap(graph0).invoke('width').should('be.closeTo', 184.720, 0.0005);
          break;
        case 'neato':
          cy.wrap(graph0).invoke('height').should('be.closeTo', 72.853, 0.0005);
          cy.wrap(graph0).invoke('width').should('be.closeTo', 184.387, 0.0005);
          break;
        case 'osage':
          cy.wrap(graph0).invoke('height').should('be.closeTo', 58.667, 0.0005);
          cy.wrap(graph0).invoke('width').should('be.closeTo', 173.693, 0.0005);
          break;
        case 'patchwork':
          cy.wrap(graph0).invoke('height').should('be.closeTo', 70.293, 0.0005);
          // patchwork width drifts by ~0.5 px across Chrome versions
          // (e.g. 70.766 in Chrome 110 headed, 70.756 in Chrome 109 headless,
          // 70.293 in Chrome 147 headless). Use a wide tolerance instead of
          // pinning a per-version value.
          cy.wrap(graph0).invoke('width').should('be.closeTo', 70.5, 0.5);
          break;
        case 'twopi':
          cy.wrap(graph0).invoke('height').should('be.closeTo', 58.667, 0.0005);
          cy.wrap(graph0).invoke('width').should('be.closeTo', 185.440, 0.0005);
          break;
        }
      });
    });

  })

  it('Fits the graph to the available area when enabled in settings', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('height').should('be.closeTo', 154.667, 0.0005);
      cy.wrap(graph0).invoke('width').should('be.closeTo', 95.867, 0.0005);
    });

    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('height').should('eq', 572);
      cy.wrap(graph0).invoke('width').should('be.closeTo', 354.541, 0.0005);
    });

    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('height').should('be.closeTo', 154.667, 0.0005);
      cy.wrap(graph0).invoke('width').should('be.closeTo', 95.867, 0.0005);
    });

  })

  it('Does not resize the graph when the window is resized if fit graph is disabled', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.canvasSvg().then(svg => {
      cy.wrap(svg).invoke('width').should('be.closeTo', 469, 25);
      cy.wrap(svg).invoke('height').should('be.closeTo', 572, 25);
      cy.wrap(svg).invoke('attr', 'viewBox').then(vb => {
        const [x, y, w, h] = vb.split(/\s+/).map(Number);
        expect(x).to.equal(0);
        expect(y).to.equal(0);
        expect(w).to.be.closeTo(351.75, 1);
        expect(h).to.be.closeTo(429, 2);
      });
      cy.wrap(svg).invoke('attr', 'width').then(w => {
        expect(Number(w)).to.be.closeTo(469, 1);
      });
      cy.wrap(svg).invoke('attr', 'height').then(h => {
        expect(Number(h)).to.be.closeTo(572, 1);
      });
    });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('width').should('be.closeTo', 95.867, 0.0005);
      cy.wrap(graph0).invoke('height').should('be.closeTo', 154.667, 0.0005);
    });

    cy.viewport(1000 * 2, 660 * 2);

    cy.canvasSvg().then(svg => {
      cy.wrap(svg).invoke('width').should('be.closeTo', 469, 25);
      cy.wrap(svg).invoke('height').should('be.closeTo', 572, 25);
      cy.wrap(svg).invoke('attr', 'viewBox').then(vb => {
        const [x, y, w, h] = vb.split(/\s+/).map(Number);
        expect(x).to.equal(0);
        expect(y).to.equal(0);
        expect(w).to.be.closeTo(351.75, 1);
        expect(h).to.be.closeTo(429, 2);
      });
      cy.wrap(svg).invoke('attr', 'width').then(w => {
        expect(Number(w)).to.be.closeTo(976, 1);
      });
      cy.wrap(svg).invoke('attr', 'height').then(h => {
        expect(Number(h)).to.be.closeTo(1232, 1);
      });
    });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('width').should('be.closeTo', 95.867, 0.0005);
      cy.wrap(graph0).invoke('height').should('be.closeTo', 154.667, 0.0005);
    });

  })

  it('Resizes the graph when the window is resized if fit graph is enabled', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });

    cy.canvasSvg().then(svg => {
      cy.wrap(svg).invoke('width').should('be.closeTo', 469, 25);
      cy.wrap(svg).invoke('height').should('be.closeTo', 572, 25);
      cy.wrap(svg).should('have.attr', 'viewBox', '0 0 71.90 116.00');
      cy.wrap(svg).should('have.attr', 'width', '469');
      cy.wrap(svg).should('have.attr', 'height', '572');
    });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('width').should('be.closeTo', 354.541, 0.0005);
      cy.wrap(graph0).invoke('height').should('be.closeTo', 572, 25);
    });

    cy.viewport(1000 * 2, 660 * 2);

    cy.canvasSvg().then(svg => {
      cy.wrap(svg).invoke('width').should('be.closeTo', 469, 25);
      cy.wrap(svg).invoke('height').should('be.closeTo', 572, 25);
      cy.wrap(svg).should('have.attr', 'viewBox', '0 0 71.90 116.00');
      cy.wrap(svg).should('have.attr', 'width', '976');
      cy.wrap(svg).should('have.attr', 'height', '1232');
    });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('width').should('be.closeTo', 763.628, 0.0005);
      cy.wrap(graph0).invoke('height').should('eq', 1232);
    });

  })

  it('Preserves the last valid render when the editor contains invalid DOT (gutter shows the error)', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);
    cy.textEditorGutterCellWithError().should('not.exist');

    cy.textEditorContent().type('{ctrl}{end}xxxxxx');

    cy.textEditorGutterCellWithError().should('exist');

    cy.canvasSvg().should('exist');
    cy.canvasGraph().should('exist');
    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);
    cy.node(1).shouldHaveLabel('Alice');
    cy.node(2).shouldHaveLabel('Bob');
  })

  it('Renders nodes with names equal to properties of the JavaScript Object type, and edges between them', function() {
    const nodeNames = getAllPropertyNames({});
    const dotSrc = `digraph {\n${nodeNames.join('-> \n')}\n}`;
    cy.startApplicationWithDotSource(dotSrc);

    const numNodes = nodeNames.length;
    const numEdges = nodeNames.length - 1;

    cy.nodes().should('have.length', numNodes);
    cy.edges().should('have.length', numEdges);

    cy.wrap(nodeNames).each((nodeName, i) => {
      const nodeIndex = i + 1;
      cy.node(nodeIndex).should('exist');
      cy.node(nodeIndex).shouldHaveName(nodeName);
      if (i > 0) {
        const prevNodeName = nodeNames[i - 1];
        const edgeIndex = nodeIndex - 1;
        cy.edge(edgeIndex).should('exist');
        cy.edge(edgeIndex).shouldHaveName(`${prevNodeName}->${nodeName}`);

      }
    });

  })

})
