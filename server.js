const express = require("express");
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

class TodoList {
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }

  getHtml() {
    return `
      <li>
        <form hx-put="/api/lists/${this.id}" hx-trigger="submit" hx-target="closest li" hx-swap="outerHTML">
          <input type="text" name="name" value="${this.name}" required />
          <button type="submit">Save</button>
        </form>
        <button hx-delete="/api/lists/${this.id}" hx-trigger="click" hx-confirm="Are you sure you want to delete this list?" hx-target="closest li" hx-swap="delete">Delete</button>
      </li>
    `;
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

// Endpoints
const todoLists = new TodoLists();

app.get("/api/lists", (req, res) => {
  const html = todoLists.getHtml();
  res.send(html);
});

app.post("/api/lists", (req, res) => {
  const newList = req.body.name; // Assuming the new string is passed in the request body as "name"
  const todoList = todoLists.addList(newList);
  const html = todoList.getHtml();
  res.send(html);
});

app.put("/api/lists/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const newName = req.body.name;

  const todoList = todoLists.findById(id);
  if (todoList) {
    todoList.name = newName;
    const html = todoList.getHtml();
    res.send(html);
  } else {
    res.status(404).json({ message: "Todo list not found" });
  }
});

app.delete("/api/lists/:id", (req, res) => {
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
