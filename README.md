# Installation

1 - Install NodeJS [link](https://nodejs.org/en/download)<br>
2 - Install Yarn [link](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)<br>
3 - Install VSCode editor [link](https://code.visualstudio.com/download)<br>
4 - Install Git bash [link](https://git-scm.com/downloads) - [document](https://git-scm.com/docs)<br>
5 - Create a folder as your workspace -> open the folder -> right click -> select **Git Bash Here**<br>
6 - At the opened terminal, clone the project<br>

> git clone https://github.com/thulilee/automation-test-project.git

7- Open VSCode editor -> File -> Open Folder... -> Select your workspace folder -> Select the cloned project name **automation-test-project**<br>
8 - In the editor, open integrated terminal (git bash mode) - [steps](https://code.visualstudio.com/docs/terminal/basics)<br>
9 - Execute below Yarn command to install the project<br>

> yarn
> OR
> yarn install

Will download then install all neccessary packages for the project.<br>

# Code format on Save

VS code settings
Refer [the link](https://www.digitalocean.com/community/tutorials/how-to-format-code-with-prettier-in-visual-studio-code) for configuration<br>

# Test execution

### UI testing

> yarn test:ui

### API testing

> yarn test:api

Or for UI testing, to open the Cypress console for tests inspection - [steps](https://docs.cypress.io/guides/getting-started/opening-the-app)<br>

> yarn cypress open

And for API testing, can use POSTMAN to open the collections for manual execution - [steps](https://learning.postman.com/docs/collections/running-collections/intro-to-collection-runs/)

# Report

### UI testing

Test executions status can be reviewed in the Cypress console<br>

### API testing

Test status for each collection is generated under **newman** folder in the root. The HTML files can be viewed by installed browsers.<br>

# Project structure

-   package.json
-   tsconfig.json
-   cypress.config.ts
-   README.md
-   **src**
    -   **api**
        -   **collections**
        -   **data**
        -   **testExecution.ts**
    -   **ui**
        -   **data**
        -   **pages**
        -   **support**
        -   **test**

# Test example

### UI test script

```
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

```

### API test execution

```
import newman from 'newman'
import fs from 'fs'

let results: Array<boolean> = []
const listOfCollections: Array<string> = fs.readdirSync(`${__dirname}/collections`)
let executedCollectionCount: number = 0

listOfCollections.forEach((f) => {
    newman
        .run({
            collection: require(`${__dirname}/collections/${f}`),
            iterationData: `${__dirname}/data/${f.replace('collection', 'data')}`,
            reporters: ['htmlextra', 'cli'],
            reporter: {
                browserTitle: 'Test report',
                title: 'Test Report',
                displayProgressBar: true
            }
        })
        .on('assertion', function (err) {
            if (err) {
                console.log(JSON.stringify(err))
                results.push(false)
            } else {
                results.push(true)
            }
        })
        .on('done', function () {
            executedCollectionCount++
            if (results.includes(false) && executedCollectionCount == listOfCollections.length) {
                console.log(JSON.stringify(results) + 'done with FAILED TEST')
                process.exit(1)
            } else {
                console.log(JSON.stringify(results) + 'done TEST')
            }
        })
})

```
