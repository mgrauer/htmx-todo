const TodoListModel = require("./TodoListModel");

class TodoListsModel {
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

module.exports = TodoListsModel;
