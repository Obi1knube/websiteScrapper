//Import necessary modules
const { chromium } = require("playwright");
const fs = require("fs");
const { Parser } = require("json2csv");

//define function to save Hacker News articles
async function saveHackerNewsArticles() {
  try {
    // launch browser
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to Hacker News
    await page.goto("https://news.ycombinator.com");

    // Wait for the page to load completely
    await page.waitForTimeout(5000); // Wait for 5 seconds

    // Find the top 10 articles
    const articles = await page.evaluate(() => {
      // Debugging: Log the NodeList length
      console.log(
        "Number of links found:",
        document.querySelectorAll(".athing").length
      );

      const links = document.querySelectorAll(".athing");
      const articlesData = [];

      // Debugging: Log the first link's inner text
      if (links.length > 0) {
        console.log("First link text:", links[0].innerText);
      }

      for (let i = 0; i < 10 && i < links.length; i++) {
        if (links[i]) {
          articlesData.push({
            title: links[i].innerText,
            url: links[i].getAttribute("href"),
          });
        }
      }

      // Log the scraped data for debugging
      console.log("Scraped Articles Data:", articlesData);

      return articlesData;
    });

    // Log the received Titles and URLs
    articles.forEach((article, index) => {
      console.log(`Title ${index + 1}: ${article.title}`);
      console.log(`URL ${index + 1}: ${article.url}`);
    });

    // Convert article data to CSV
    const json2csvParser = new Parser({ fields: ["title", "url"] });
    const csv = json2csvParser.parse(articles);

    // Save articles to CSV file
    fs.writeFileSync("hacker_news_articles.csv", csv);

    console.log("CSV file created successfully!");

    // Close the browser after a delay of 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await browser.close();
  } catch (error) {
    console.error("An error occurred during scraping and CSV writing:", error);
  }
}

// Execute the function
(async () => {
  try {
    await saveHackerNewsArticles();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
