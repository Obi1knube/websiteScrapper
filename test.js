const { test, expect } = require("@playwright/test");
const { chromium } = require("playwright");
const fs = require("fs");
const objectsToCsv = require("objects-to-csv");
const ObjectsToCsv = require("objects-to-csv");

test("Save Hacker News Articles to CSV", async ({ page }) => {
  // launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  //Mock the articles data
  const mockArticles = [
    { title: "mock Article 1", url: "https://news.ycombinator.com" },
    // { title: "mock Article 2", url: "https://example.com/article2" },
    // { title: "mock Article 3", url: "https://example.com/article3" },
    // { title: "mock Article 4", url: "https://example.com/article4" },
    // { title: "mock Article 5", url: "https://example.com/article5" },
    // { title: "mock Article 6", url: "https://example.com/article6" },
    // { title: "mock Article 7", url: "https://example.com/article7" },
    // { title: "mock Article 8", url: "https://example.com/article8" },
    // { title: "mock Article 9", url: "https://example.com/article9" },
    // { title: "mock Article 1o", url: "https://example.com/article10" },
  ];

  // Mock the objectsToCsv function
  const mockObjectsToCsv = jest.fn().mockReturnValue({
    toDisk: jest.fn().mockResolvedValue(),
  });

  // Mock the page functions
  page.$$eval = jest
    .fn()
    .mockImplementation((selector, callback) => callback(mockArticles));

  // Mock the fs module
  fs.writeFileSync = jest.fn();

  // Mock the objectsToCsv module
  jest.mock("objects-to-csv", () => {
    return jest.fn().mockImplementation(() => mockObjectsToCsv);
  });

  // Call the function to save Hacker News articles
  await ObjectsToCsv();

  // Assertions
  expect(page.$$eval).toHaveBeenCalledWith(".storylink", expect.any(Function));
  expect(mockObjectsToCsv).toHaveBeenCalledWith(mockArticles);
  expect(mockObjectsToCsv().toDisk).toHaveBeenCalledWith(
    "./csv/hacker_news_articles"
  );

  // Close the browser
  await browser.close();
});
