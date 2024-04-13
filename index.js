const { chromium } = require("playwright");
const fs = require("fs");
const ObjectsToCsv = require("objects-to-csv");

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  // Find the top 10 articles
  const articles = await page.$$eval(".storylink", (links) => {
    const articlesData = [];
    for (let i = 0; i < 10 && i < links.length; i++) {
      if (links[i]) {
        articlesData.push({
          title: links[i].innerText,
          url: links[i].href,
        });
      }
    }
    return articlesData;
  });

  // Save data to CSV file
  const csv = new ObjectsToCsv(articles);
  await csv.toDisk("./hacker_news_articles.csv");

  // Close the browser after a delay of 10 seconds
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await browser.close();
}

(async () => {
  try {
    await saveHackerNewsArticles();
  } catch (error) {
    console.error("An error occured:", error);
  }
})();
