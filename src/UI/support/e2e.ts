import 'cypress-wait-until'

Cypress.Commands.add('checkMatchedText', (element, searchStr) => {
    const regex = new RegExp(`\\b${searchStr.replace(/[@#$%^&"]/g, '').replace(' ', '\\b|\\b')}\\b`, 'i')
    const eleTxt = element.text()
    cy.log(eleTxt)
    cy.log(regex.source)
    expect(regex.test(eleTxt)).eq(true)
})
