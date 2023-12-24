import { locator } from '../pages/locatorImport'
import { searchDataExisting } from '../data/dataImport'
import qs from 'querystring'

describe('Feature - Search Wikipedia for pages containing specific text', () => {
    searchDataExisting.forEach((data) => {
        it(`Verify search text input - existing result matching the query - ${data.searchStr}`, () => {
            cy.visit('https://en.wikipedia.org/wiki/Main_Page')
            cy.get(locator.searchBox).type(data.searchStr)

            cy.contains(locator.searchSpan).invoke('text').should('eq', `Search for pages containing ${data.searchStr}`)

            cy.contains(locator.searchSpan).click()

            cy.waitUntil(() => {
                return cy.url().then((url) => {
                    expect(url).to.be.contains(qs.stringify({ search: data.searchStr }, null, null).replace('%20', '+'))
                })
            })

            cy.get(locator.matchedItem, { timeout: 6000 }).each((element) => {
                cy.checkMatchedText(element, data.searchStr)
            })
        })
    })
})
