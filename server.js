const express = require("express");
const path = require("path");
const pug = require("pug");
const { readTodos, writeTodos } = require("./dataHandler");

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));

class TodoList {
  constructor(name, id, todos = []) {
    this.name = name;
    this.id = id;
    this.todos = todos;
  }

  updateName(newName) {
    this.name = newName;
  }

  getHtml() {
    const templatePath = path.join(__dirname, "views", "todoList.pug");
    const compiledTemplate = pug.compileFile(templatePath);
    const html = compiledTemplate({ name: this.name, id: this.id });
    return html;
  }
}

class TodoLists {
  constructor(todoListsData) {
    if (Array.isArray(todoListsData)) {
      this.maxId = 0;
      this.todoLists = todoListsData.map((item) => {
        if (item.id > this.maxId) {
          this.maxId = item.id;
        }
        return new TodoList(item.name, item.id, item.todos);
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
    const todoList = new TodoList(newList, id);
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
