const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function scrapeEvents() {
  try {
    const { data } = await axios.get("https://www.eventbrite.com.au/d/australia--sydney/events/");
    const $ = cheerio.load(data);
    const events = [];

    $(".eds-event-card-content__content").each((i, el) => {
      const title = $(el).find(".eds-event-card-content__title").text().trim();
      const date = $(el).find(".eds-event-card-content__sub-title").text().trim();
      const link = $(el).closest("a").attr("href");

      if (title && date && link) {
        events.push({ title, date, link });
      }
    });

    fs.writeFileSync("events.json", JSON.stringify(events, null, 2));
    console.log("✅ Events scraped successfully");
  } catch (err) {
    console.error("❌ Error scraping events:", err.message);
  }
}

module.exports = scrapeEvents;
