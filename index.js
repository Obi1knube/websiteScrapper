// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const fs = require('fs');
const objectsToCsv =require ('objects-to-csv');

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  //Find the top 10 articles
const articles = await page.$$eval('.storylink',(links)=>{
  const articlesData =[];
  for (let i =0; i<10; i++){
    articlesData.push({
      title: links[i].innerText,
      url:links[i].href
    });
  }
  return articlesData
});


}

(async () => {
  await saveHackerNewsArticles();
})();
