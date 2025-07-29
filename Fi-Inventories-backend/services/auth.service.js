const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, hashedPassword]
  );
  return newUser.rows[0];
};

const loginUser = async (credentials) => {
  const { email, password } = credentials;
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (user.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user.rows[0].id }, JWT_SECRET, { expiresIn: "1h" });
  return { token, user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email } };
};

module.exports = {
  registerUser,
  loginUser,
}; 