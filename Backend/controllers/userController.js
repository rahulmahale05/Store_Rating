import bcrypt from "bcryptjs";
import db from "../config/db.js";

// Register
export const registerUser = async (req, res) => {
  const { Name, Email, Address, Password } = req.body;
  if (!Name || !Email || !Password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const hashedPassword = await bcrypt.hash(Password, 10);

  db.query(
    "INSERT INTO users (name, email, address, password) VALUES (?, ?, ?, ?)",
    [Name, Email, Address || "", hashedPassword],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "User already exists" });
        }
        return res.status(500).json(err);
      }
      res.json({ message: "User registered successfully" });
    }
  );
};

// Login
export const loginUser = (req, res) => {
  const { Email, Password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [Email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    const isMatch = await bcrypt.compare(Password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
  });
};

// Get all users
export const getUsers = (req, res) => {
  db.query("SELECT name, email, address, created_at FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    if (results.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Failed to update password", err });
        res.json({ message: "Password updated successfully" });
      }
    );
  });
};