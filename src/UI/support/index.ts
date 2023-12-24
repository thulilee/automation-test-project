export {}
declare global {
    namespace Cypress {
        interface Chainable {
            checkMatchedText(element, searchStr): Chainable<void>
        }
    }
}
