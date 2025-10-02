const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const [result] = await pool.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );

  const [newUser] = await pool.query("SELECT id, username, email FROM users WHERE id = ?", [result.insertId]);

  const user = newUser[0];
  return { id: user.id, name: user.username, email: user.email };
};

const loginUser = async (credentials) => {
  const { email, password } = credentials;
  const [userRows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

  if (userRows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = userRows[0];
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    // Increment failed_attempts
    await pool.query(
      "UPDATE users SET failed_attempts = failed_attempts + 1 WHERE email = ?",
      [email]
    );

    // Re-fetch the updated failed_attempts value
    const [updatedUserRows] = await pool.query(
      "SELECT failed_attempts FROM users WHERE email = ?",
      [email]
    );

    const failedAttempts = updatedUserRows[0].failed_attempts;

    // Check if account should be locked
    if (failedAttempts >= 3) {
      await pool.query(
        "UPDATE users SET failed_attempts = 0 WHERE email = ?",
        [email]
      );
      throw new Error(
        "Account locked due to multiple failed attempts. Please try again later after 1 minute."
      );
    }

    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  return { token, user: { id: user.id, name: user.username, email: user.email } };
};

module.exports = {
  registerUser,
  loginUser,
}; 