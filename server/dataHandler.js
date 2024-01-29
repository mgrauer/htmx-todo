const fs = require("fs");
const filePath = "data/storage.json";

function readJsonFile() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const jsonArray = JSON.parse(data).todoLists || [];
    return Array.isArray(jsonArray) ? jsonArray : [];
  } catch (err) {
    console.error(`Error reading file from disk: ${err}`);
    return [];
  }
}

function writeJsonFile(data) {
  try {
    const stringifiedData = JSON.stringify({ todoLists: data }, null, 2);
    fs.writeFileSync(filePath, stringifiedData);
  } catch (err) {
    console.error(`Error writing file on disk: ${err}`);
  }
}

function readTodos() {
  return readJsonFile();
}

function writeTodos(data) {
  writeJsonFile(data);
}

module.exports = {
  readTodos,
  writeTodos,
};
