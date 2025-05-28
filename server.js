const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const scrapeEvents = require("./scraper");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Use env PORT for deployment

// Serve static files (like CSS) from "public" folder
app.use(express.static("public"));

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  const events = JSON.parse(fs.readFileSync("events.json", "utf8"));
  res.render("index", { events });
});

app.post("/get-tickets", (req, res) => {
  const { email, link } = req.body;
  console.log(`User Email: ${email}`);
  res.redirect(link);
});

// Schedule scraping every 6 hours
cron.schedule("0 */6 * * *", () => {
  console.log("⏰ Scheduled scraping started");
  scrapeEvents();
});

// Start server
app.listen(PORT, () => {
  //scrapeEvents(); // Initial scrape on server start
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
