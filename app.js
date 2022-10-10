const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let today = new Date();
let currentDay = today.getDay();
let day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  // if (currentDay === 6 || currentDay === 0) {
  //   day = "Weekend";
  // } else {
  //   day = "Weekday";
  // }

  res.render("list", { kindOfDay: day[currentDay] });
});

app.listen(3000, (req, res) => {
  console.log(currentDay);
});
