const cron = require("node-cron");
const scrapeEventbrite = require("./scrapers/eventbrite");

cron.schedule("*/30 * * * *", async () => {
  console.log("Running scraper...");
  await scrapeEventbrite();
});