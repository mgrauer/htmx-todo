const express = require("express");
const path = require("path");
const pug = require("pug");
const app = express();
const port = 3000;

app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));

class TodoList {
  constructor(name, id) {
    this.name = name;
    this.id = id;
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
  constructor() {
    this.todoLists = [
      new TodoList("jobs", 1),
      new TodoList("house", 2),
      new TodoList("personal", 3),
    ];
  }

  getHtml() {
    return this.todoLists.map((item) => item.getHtml()).join("");
  }

  addList(newList) {
    const id = this.todoLists.length + 1;
    const todoList = new TodoList(newList, id);
    this.todoLists.push(todoList);
    return todoList;
  }

  findById(id) {
    return this.todoLists.find((list) => list.id === id);
  }

  deleteList(id) {
    const index = this.findById(id);
    if (index !== -1) {
      this.todoLists.splice(index, 1);
      return true;
    }
    return false;
  }
}

const todoLists = new TodoLists();

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
  res.send(html);
});

app.put("/api/list/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const newName = req.body.name;
  const todoList = todoLists.findById(id);
  if (todoList) {
    todoList.updateName(newName);
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
