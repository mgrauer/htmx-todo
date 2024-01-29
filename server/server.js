const express = require("express");
const path = require("path");
const pug = require("pug");
const { readTodos, writeTodos } = require("./dataHandler");
const TodoListModel = require("./models/TodoListModel");

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));

class TodoLists {
  constructor(todoListsData) {
    if (Array.isArray(todoListsData)) {
      // TODO: all this business with maxId is to maintain unique ids
      // it's better off in a persistence layer
      this.maxId = 0;
      this.todoLists = todoListsData.map((item) => {
        if (item.id > this.maxId) {
          this.maxId = item.id;
        }
        return new TodoListModel(item.name, item.id, item.todos);
      });
    } else {
      this.todoLists = [];
      this.maxId = 0;
    }
  }

  getHtml() {
    return this.todoLists.map((item) => item.getHtml()).join("");
  }

  getData() {
    return this.todoLists;
  }

  addList(newList) {
    this.maxId += 1;
    const id = this.maxId;
    const todoList = new TodoListModel(newList, id);
    this.todoLists.push(todoList);
    return todoList;
  }

  findById(id) {
    return this.todoLists.find((list) => list.id === id);
  }

  deleteList(id) {
    const index = this.todoLists.findIndex((list) => list.id === id);
    if (index !== -1) {
      this.todoLists.splice(index, 1);
      return true;
    }
    return false;
  }
}

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
  todoLists = new TodoLists(todos);

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();

module.exports = app;
