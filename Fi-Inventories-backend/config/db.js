const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require('path');

const pool = mysql.createPool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(process.cwd(), 'ca.pem')).toString(),
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected");
    connection.release();
  } catch (error) {
    console.error("Error connecting to MySQL", error);
    process.exit(1);
  }
};

module.exports = { pool, connectDB }; 