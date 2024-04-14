const { chromium } = require("playwright");
const fs = require("fs");
const { Parser } = require("json2csv");

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
          url: links[i].getAttribute("href"),
        });
      }
    }
    return articlesData;
  });

  
  // Covert article  data to CSV
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(articles);

  //Save data to CSV file
  fs.writeFileSync("./csv/hacker_news_articles.csv", csv); 

      console.log("csv file created successfully!");
    
 
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
