/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
describe('ExpandableBlock', () => {
  const storyPath = 'Core/ExpandableBlock';
  const tests = [
    'Basic',
    'Borderless',
    'Accordion',
    'Small',
    'Status Icon',
    'With Caption',
    'Disabled',
  ];

  tests.forEach((testName) => {
    it(testName, function () {
      const id = Cypress.storyId(storyPath, testName);
      cy.visit('iframe', { qs: { id } });
      cy.compareSnapshot(`${testName} (Closed)`);
      if (testName !== 'Disabled') {
        cy.get('[type=button]').first().click();
        cy.compareSnapshot(`${testName} (Open)`);
      }
    });
  });
});
