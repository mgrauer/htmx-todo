const path = require("path");
const pug = require("pug");

class TodoListModel {
  constructor(name, id, todos = []) {
    this.name = name;
    this.id = id;
    this.todos = todos;
  }

  updateName(newName) {
    this.name = newName;
  }

  getHtml() {
    const templatePath = path.join(
      __dirname,
      "..",
      "..",
      "views",
      "todoList.pug"
    );
    let html;
    try {
      const compiledTemplate = pug.compileFile(templatePath);
      html = compiledTemplate({ name: this.name, id: this.id });
    } catch (error) {
      console.error("Error compiling Pug template:", error);
      html = "<p>borked - cannot find pug</p>";
    }
    return html;
  }
}

module.exports = TodoListModel;
