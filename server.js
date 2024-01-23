const express = require("express");
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let todo_lists = ["jobs", "house", "personal"];

// Endpoints

app.get("/api/lists", (req, res) => {
  const html = `${todo_lists.map((item) => `<li>${item}</li>`).join("")}`;
  res.send(html);
});

app.post("/api/lists", (req, res) => {
  const newList = req.body.name; // Assuming the new string is passed in the request body as "list"
  todo_lists.push(newList); // Add the new string to the todo_lists array
  const html = `<li>${newList}</li>`;
  res.send(html);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
