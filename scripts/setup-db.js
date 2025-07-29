const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../Fi-Inventories-backend/.env") });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(process.env.CA_CERT).toString(),
  },
});

const setupDatabase = async () => {
  try {
    const schema = fs.readFileSync(path.resolve(__dirname, "/schema.sql"), "utf8");
    await pool.query(schema);
    console.log("Database tables created successfully.");
  } catch (error) {
    console.error("Error setting up the database:", error);
  } finally {
    pool.end();
  }
};

setupDatabase();
