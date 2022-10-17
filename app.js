const express = require("express");
const date = require(`${__dirname}/date.js`);
const mongoose = require("mongoose");

const app = express();

const workItems = [];
const listSchema = {
  name: String,
  items: [itemsSchema],
};

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todoListDB");

const todoListSchema = new mongoose.Schema({
  name: String,
});
const TodoListItem = mongoose.model("todoListItem", todoListSchema);
const List = mongoose.model("list", listSchema);

const one = new TodoListItem({ name: "Buy Food" });
const two = new TodoListItem({ name: "Cook Food" });
const three = new TodoListItem({ name: "Eat Food" });
const defaultItems = [one, two, three];

app.get("/", (req, res) => {
  TodoListItem.find({}, (err, newItems) => {
    if (newItems.length) {
      res.render("list", { listTitle: "Today", newItems });
    } else {
      TodoListItem.insertMany(defaultItems, (error, docs) => {
        res.redirect("/");
      });
    }
  });
});
app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newItems: workItems });
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;
  const list = new List({
    name: customListName,
    items: defaultItems,
  });
});

app.post("/", (req, res) => {
  // let buttonName = req.body.list;
  const item = new TodoListItem({ name: String(req.body.newItem) });
  item.save((err) => {
    res.redirect("/");
  });
});
app.post("/work", (req, res) => {
  let arrayItem = req.body.newItem;
  workItems.push(arrayItem);
  res.redirect("/work");
});
app.post("/delete", async (req, res) => {
  await TodoListItem.deleteOne({ _id: String(req.body.itemId) });
  res.redirect("/");
});

app.listen(3000, (req, res) => {});
