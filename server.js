const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const scrapeEvents = require("./scraper");
const cron = require("node-cron");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const events = JSON.parse(fs.readFileSync("events.json"));
  res.render("index", { events });
});

app.post("/get-tickets", (req, res) => {
  const { email, link } = req.body;
  console.log(`User Email: ${email}`);
  res.redirect(link);
});

// Auto scrape every 6 hours
cron.schedule("0 */6 * * *", () => {
  console.log("⏰ Scheduled scraping started");
  scrapeEvents();
});

app.listen(PORT, () => {
  scrapeEvents(); // scrape on first load
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
