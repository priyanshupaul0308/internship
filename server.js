const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files like style.css
app.use(express.static("public"));

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Route: Home - loads static events from events.json
app.get("/", (req, res) => {
  try {
    const events = JSON.parse(fs.readFileSync("events.json", "utf8"));
    res.render("index", { events });
  } catch (error) {
    console.error("Error reading events.json:", error.message);
    res.render("index", { events: [] });
  }
});

// Route: Handle ticket request
app.post("/get-tickets", (req, res) => {
  const { email, link } = req.body;
  console.log(`User Email: ${email}`);
  res.redirect(link);
});

// Server Start (no scraping)
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
