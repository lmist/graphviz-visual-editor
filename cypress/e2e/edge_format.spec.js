describe('Edge Format drawer workflow', function() {
  const edgeStyles = [
    'dashed',
    'dotted',
    'solid',
    'invis',
    'bold',
    'tapered',
  ];

  it('opens from the toolbar and closes without losing the graph', function() {
    cy.startApplicationWithDotSource('digraph {Alice Bob}');

    cy.canvasGraph().should('be.visible');
    cy.nodes().should('have.length', 2);
    cy.edges().should('not.exist');
    cy.textEditorWrapper().should('be.visible');

    cy.toolbarButton('Edge format').click();

    cy.formatDrawer().should('be.visible');
    cy.get('#format-drawer-title').should('have.text', 'Default edge attributes');
    cy.styles().should('have.text', edgeStyles.join(''));
    cy.styles().should('not.contain.text', 'radial');
    cy.textEditorWrapper().should('not.be.visible');
    cy.canvasGraph().should('be.visible');

    cy.formatDrawerCloseButton().click();

    cy.formatDrawer().should('not.exist');
    cy.textEditorWrapper().should('be.visible');
    cy.canvasGraph().should('be.visible');
  });

  it('applies style, color, and fillcolor defaults to a drawn edge', function() {
    cy.startApplicationWithDotSource('digraph {Alice Bob}');

    cy.nodes().should('have.length', 2);
    cy.edges().should('not.exist');

    cy.toolbarButton('Edge format').click();
    cy.styleSwitch().click();
    cy.style('dashed').click();
    cy.colorSwitch().click();
    cy.colorPickerInput().type('#8a2be2');
    cy.fillColorSwitch().click();
    cy.fillColorPickerInput().type('#00a676');

    cy.node(1).trigger('contextmenu', { force: true });
    cy.edge(1).should('exist');
    cy.node(2).trigger('mousemove');
    cy.node(2).dblclick();

    cy.waitForTransition();

    cy.edges().should('have.length', 1);
    cy.edge(1).shouldHaveName('Alice->Bob');
    cy.edge(1).find('path').should('have.attr', 'stroke-dasharray', '5,2');
    cy.edge(1).find('path').should('have.attr', 'stroke', '#8a2be2');
    cy.edge(1).find('polygon').should('have.attr', 'fill', '#00a676');
  });
});
