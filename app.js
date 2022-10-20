const express = require("express");
const date = require(`${__dirname}/date.js`);
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

// const workItems = [];

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todoListDB");

const todoListSchema = new mongoose.Schema({
  name: String,
});
const listSchema = {
  name: String,
  items: [todoListSchema],
};
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
// app.get("/work", (req, res) => {
//   res.render("list", { listTitle: "Work List", newItems: workItems });
// });
// app.get("/about", (req, res) => {
//   res.render("about");
// });
app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err && !foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems,
      });
      list.save();
      res.redirect(`/${customListName}`);
    } else
      res.render("list", {
        listTitle: foundList.name,
        newItems: foundList.items,
      });
  });
});

app.post("/", (req, res) => {
  let buttonName = req.body.list;
  const item = new TodoListItem({ name: String(req.body.newItem) });

  if (buttonName === "Today") {
    item.save((err) => {
      res.redirect("/");
    });
  } else {
    List.updateOne(
      { name: buttonName },
      { $push: { items: item } },
      (params) => {
        res.redirect(`/${buttonName}`);
      }
    );
  }
});
// app.post("/work", (req, res) => {
//   let arrayItem = req.body.newItem;
//   workItems.push(arrayItem);
//   res.redirect("/work");
// });
app.post("/delete", (req, res) => {
  const listName = req.body.listName;
  const itemId = req.body.itemId;

  if (listName === "Today") {
    TodoListItem.deleteOne({ _id: String(itemId) }, (err) => {
      res.redirect("/");
    });
  } else {
    List.updateOne(
      { name: listName },
      { $pull: { items: { _id: String(itemId) } } },
      (err) => {
        res.redirect(`/${listName}`);
      }
    );
  }
});

app.listen(3000, (req, res) => {});
