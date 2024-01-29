const express = require("express");
const path = require("path");
const TodoListsModel = require("./models/TodoListsModel");

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));

// Endpoints

// Root Endpoint for page load

app.get("/", (req, res) => {
  if (typeof todoLists === "undefined") {
    todoLists = new TodoListsModel();
  }

  const todoListsHtml = todoLists.getHtml();
  res.render("index", { title: "Todo Lists", todoLists: todoListsHtml });
});

// TodoList Endpoints

app.post("/api/list", (req, res) => {
  const newList = req.body.name;
  const todoList = todoLists.addList(newList);
  const html = todoList.getHtml();
  res.send(html);
});

app.put("/api/list/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const newName = req.body.name;
  const todoList = todoLists.updateTodoListName(id, newName);
  if (todoList) {
    const html = todoList.getHtml();
    res.send(html);
  } else {
    res.status(404).json({ message: "Todo list not found" });
  }
});

app.delete("/api/list/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const wasDeleted = todoLists.deleteList(id);
  if (wasDeleted) {
    res.json({ message: "List deleted!" });
  } else {
    res.status(404).json({ message: "List not found" });
  }
});

// Server startup

function startServer() {
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();

module.exports = app;
