//Import necessary modules
const { chromium } = require("playwright");
const fs = require("fs");
const { Parser } = require("json2csv");

//define function to save Hackers News articles
async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to Hacker News
  await page.goto("https://news.ycombinator.com");

  // Find the top 10 articles
  const articles = await page.evaluate(() => {
    const links = document.querySelectorAll(".storylink");
    const articlesData = [];

    for (let i = 0; i < 10 && i < links.length; i++) {
      if (links[i]) {
        articlesData.push({
          title: links[i].innerText,
          url: links[i].getAttribute("href"),
        });
      }
    }
    console.log("Articles Data:", articlesData);
    return articlesData;
  });

  //Log the recieved Titles and URLs
  articles.forEach((article, index) => {
    console.log(`Title ${index + 1}: ${article.title}`);
    console.log(`URL ${index + 1}: ${article.url}`);
  });

  //Convert article data to CSV
  const json2csvParser = new Parser({ fields: ["title", "url"] });
  const csv = json2csvParser.parse(articles);

  //Save articles to CSV file
  fs.writeFileSync("hacker_news_articles.csv", csv);

  console.log("CSV file created successfully!");

  // Close the browser after a delay of 10 seconds
  await new Promise((resolve) => setTimeout(resolve, 100000));
  await browser.close();
}

//Execute the functions
(async () => {
  try {
    await saveHackerNewsArticles();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
