const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
    [name, email, hashedPassword]
  );
  const user = newUser.rows[0];
  return { id: user.id, name: user.username, email: user.email };
};

const loginUser = async (credentials) => {
  const { email, password } = credentials;
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (user.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!validPassword) {
    // Increment failed_attempts
    await pool.query(
      "UPDATE users SET failed_attempts = failed_attempts + 1 WHERE email = $1",
      [email]
    );

    // Re-fetch the updated failed_attempts value
    const updatedUser = await pool.query(
      "SELECT failed_attempts FROM users WHERE email = $1",
      [email]
    );

    const failedAttempts = updatedUser.rows[0].failed_attempts;

    // Check if account should be locked
    if (failedAttempts >= 3) {
      await pool.query(
        "UPDATE users SET failed_attempts = 0 WHERE email = $1",
        [email]
      );
      throw new Error(
        "Account locked due to multiple failed attempts. Please try again later after 1 minute."
      );
    }

    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user.rows[0].id }, JWT_SECRET, { expiresIn: "7d" });
  return { token, user: { id: user.rows[0].id, name: user.rows[0].username, email: user.rows[0].email } };
};

module.exports = {
  registerUser,
  loginUser,
}; 