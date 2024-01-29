// config.js
const path = require("path");

module.exports = {
  pugBasePath: path.join(__dirname, "views"),
  dbType: "json",
  dbBasePath: path.join(__dirname, "server", "db"),
};
