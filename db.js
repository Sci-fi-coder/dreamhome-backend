const mysql = require("mysql2");
require("dotenv").config();

// Create a connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",  // Default to localhost
  port: process.env.DB_PORT || 3306,        // Default MySQL port
  user: process.env.DB_USER || "root",      // MySQL username
  password: process.env.DB_PASS || "iiitdwd",      // MySQL password
  database: process.env.DB_NAME || "dreamhome",  // Database name
});

// Connect to MySQL and handle errors
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed: " + err.stack);
    return;
  }
  console.log("✅ Connected to MySQL database.");
});

module.exports = db;
