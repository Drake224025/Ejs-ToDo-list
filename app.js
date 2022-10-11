const express = require("express");
const date = require(`${__dirname}/date.js`);

const app = express();

const newItems = ["But Food", "Cook Food", "Eat Food"];
const workItems = [];

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  const day = date.getDate();
  res.render("list", { listTitle: day, newItems });
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newItems: workItems });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/", (req, res) => {
  let buttonName = req.body.list;
  let arrayItem = req.body.newItem;
  if (buttonName === "Work List") {
    workItems.push(arrayItem);
    res.redirect("/work");
  } else {
    newItems.push(arrayItem);
    res.redirect("/");
  }
});

app.post("/work", (req, res) => {
  let arrayItem = req.body.newItem;

  workItems.push(arrayItem);
  res.redirect("/work");
});

app.listen(3000, (req, res) => {});
