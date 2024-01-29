// db.js
const configPath = require("path").join(process.cwd(), "config");
const config = require(configPath);

let db;
switch (config.dbType) {
  case "json":
    db = require("./jsonPersistence");
    break;
  // Add other cases as needed for different types of databases
  default:
    throw new Error(`Unsupported db type: ${config.dbType}`);
}

module.exports = db;
