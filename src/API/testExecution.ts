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
