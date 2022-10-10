const express = require("express");
const bodyParser = require("body-parser");
const app = express();

let today = new Date();
let currentDay = today.getDay();
let options = {
  weekday: "long",
  day: "numeric",
  month: "long",
};
let day;
let newItems = [];

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  day = today.toLocaleDateString("en-US", options);
  res.render("list", { kindOfDay: day, newItems });
});

app.post("/", (req, res) => {
  newItems.push(req.body.newItem);
  res.redirect("/");
  console.log(newItems);
});

app.listen(3000, (req, res) => {
  console.log(currentDay);
});
