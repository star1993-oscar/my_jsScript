const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "mac";
const DB_PASSWORD = process.env.DB_PASSWORD || "asdfasdf";
const DB_NAME = process.env.DB_NAME || "mac_rat";

const pool = mysql.createPool({
  connectionLimit: 10,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

module.exports = pool;
