const fs = require("fs");

//read the CSV file and log its content
fs.readFile("hacker_news_articles.csv", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading csvfile:", err);
    return;
  }
  console.log("CSV file content");
  console.log(data);
});
