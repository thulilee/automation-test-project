import { searchDataExisting, searchDataNonExisting } from "../data/dataImport";
import qs from "querystring";

describe("Feature - Search Wikipedia for pages containing specific text", () => {
  searchDataExisting.forEach((data) => {
    it(`Verify search text input - existing result matching the query - ${data.searchStr}`, () => {
      cy.visit("https://en.wikipedia.org/wiki/Main_Page");
      cy.get("input[class='cdx-text-input__input']").type(data.searchStr);

      cy.contains("Search for pages containing")
        .invoke("text")
        .should("eq", `Search for pages containing ${data.searchStr}`);

      cy.contains("Search for pages containing").click();

      cy.waitUntil(() => {
        return cy.url().then((url) => {
          expect(url).to.be.contains(
            qs
              .stringify({ search: data.searchStr }, null, null)
              .replace("%20", "+")
          );
        });
      });

      cy.get("div[class='searchresult']", { timeout: 6000 }).each((element) => {
        const regex = new RegExp(
          `\\b${data.searchStr.replace('"', "").replace(" ", "\\b|\\b")}\\b`,
          "i"
        );

        cy.log(element.text());

        expect(regex.test(element.text())).eq(true);

        // .mw-search-pager-bottom .mw-nextlink
      });
    });
  });
});
