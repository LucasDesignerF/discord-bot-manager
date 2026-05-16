// src/database.js
const { JsonDatabase } = require("wio.db");

const db = new JsonDatabase({
    databasePath: "./database.json"
});

module.exports = db;