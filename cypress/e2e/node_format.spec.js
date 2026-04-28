describe('Node Format drawer workflow', function() {
  const nodeStyles = [
    'dashed',
    'dotted',
    'solid',
    'invis',
    'bold',
    'filled',
    'striped',
    'wedged',
    'diagonals',
    'rounded',
    'radial',
  ];

  it('opens, switches to Edge Format, and closes without losing the graph', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.canvasGraph().should('be.visible');
    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);
    cy.textEditorWrapper().should('be.visible');

    cy.toolbarButton('Node format').click();

    cy.formatDrawer().should('be.visible');
    cy.get('#format-drawer-title').should('have.text', 'Default node attributes');
    cy.styles().should('have.text', nodeStyles.join(''));
    cy.textEditorWrapper().should('not.be.visible');
    cy.canvasGraph().should('be.visible');

    cy.toolbarButton('Edge format').click();

    cy.formatDrawer().should('be.visible');
    cy.get('#format-drawer-title').should('have.text', 'Default edge attributes');
    cy.styles().should('have.text', 'dasheddottedsolidinvisboldtapered');
    cy.styles().should('not.contain.text', 'radial');
    cy.canvasGraph().should('be.visible');

    cy.formatDrawerCloseButton().click();

    cy.formatDrawer().should('not.exist');
    cy.textEditorWrapper().should('be.visible');
    cy.canvasGraph().should('be.visible');
  });

  it('applies style, color, and fillcolor defaults to an inserted node', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.toolbarButton('Node format').click();
    cy.styleSwitch().click();
    cy.style('dashed').click();
    cy.style('filled').click();
    cy.colorSwitch().click();
    cy.colorPickerInput().type('#336699');
    cy.fillColorSwitch().click();
    cy.fillColorPickerInput().type('#f2c14e');

    cy.canvasGraph().trigger('mousedown', 'topLeft', { which: 2, shiftKey: true });
    cy.canvasGraph().trigger('mouseup', 'topLeft', { which: 2, shiftKey: true });

    cy.waitForTransition();

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 1);
    cy.node(3).shouldHaveName('n2');
    cy.node(3).find('ellipse').should('have.attr', 'stroke-dasharray', '5,2');
    cy.node(3).find('ellipse').should('have.attr', 'stroke', '#336699');
    cy.node(3).find('ellipse').should('have.attr', 'fill', '#f2c14e');
  });
});
