// config.js
const path = require("path");
let jsonDbFilePath = path.join(process.cwd(), "data");

if (process.env.NODE_ENV === "test") {
  jsonDbFilePath = path.join(jsonDbFilePath, "test-storage.json");
} else {
  jsonDbFilePath = path.join(jsonDbFilePath, "storage.json");
}

module.exports = {
  pugBasePath: path.join(__dirname, "views"),
  dbType: "json",
  jsonDbFilePath: jsonDbFilePath,
  dbBasePath: path.join(__dirname, "server", "db"),
};
