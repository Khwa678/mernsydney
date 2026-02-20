async function scrapeEventbrite() {
  try {
    console.log("Scraping Eventbrite...");

    const { data } = await axios.get(
      "https://www.eventbrite.com.au/d/australia--sydney/events/"
    );

    const $ = cheerio.load(data);

    const scrapedUrls = [];

    $("a[href*='/e/']").each((i, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr("href");

      if (title.length > 10 && url) {
        const fullUrl = url.startsWith("http")
          ? url
          : `https://www.eventbrite.com.au${url}`;

        scrapedUrls.push(fullUrl);
      }
    });

    console.log(`Found ${scrapedUrls.length} live events`);

    // Mark inactive events
    const allDbEvents = await Event.find({ sourceWebsite: "Eventbrite" });

    for (const dbEvent of allDbEvents) {
      if (!scrapedUrls.includes(dbEvent.originalUrl)) {
        dbEvent.status = "inactive";
        await dbEvent.save();
        console.log("Marked inactive:", dbEvent.title);
      }
    }

    console.log("Inactive detection complete.");

  } catch (error) {
    console.log("Scraper Error:", error.message);
  }
}