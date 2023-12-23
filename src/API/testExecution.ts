import newman from "newman";

newman.run({
  collection: require("./collections/Get_wikipedia_collection_collection.json"),
  iterationData: `${__dirname}/data/data.json`,
  reporters: ["htmlextra", "cli"],
  reporter: {
    export: `${__dirname}/report/report.html`,
    browserTitle: "Test report",
    title: "Test Report",
    displayProgressBar: true,
  },
});
