const express = require("express");
const path = require("path");
const pug = require("pug");
const { readTodos, writeTodos } = require("./dataHandler");
const TodoListsModel = require("./models/TodoListsModel");

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));

function persistTodoLists() {
  writeTodos(todoLists.getData());
}

// Endpoints

// Root Endpoint for page load

app.get("/", (req, res) => {
  const todoListsHtml = todoLists.getHtml();
  res.render("index", { title: "Todo Lists", todoLists: todoListsHtml });
});

// TodoList Endpoints

app.post("/api/list", (req, res) => {
  const newList = req.body.name;
  const todoList = todoLists.addList(newList);
  const html = todoList.getHtml();
  persistTodoLists();
  res.send(html);
});

app.put("/api/list/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const newName = req.body.name;
  const todoList = todoLists.findById(id);
  if (todoList) {
    todoList.updateName(newName);
    const html = todoList.getHtml();
    persistTodoLists();
    res.send(html);
  } else {
    res.status(404).json({ message: "Todo list not found" });
  }
});

app.delete("/api/list/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const wasDeleted = todoLists.deleteList(id);
  if (wasDeleted) {
    persistTodoLists();
    res.json({ message: "List deleted!" });
  } else {
    res.status(404).json({ message: "List not found" });
  }
});

// Server startup

function startServer() {
  const todos = readTodos();
  todoLists = new TodoListsModel(todos);

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();

module.exports = app;
