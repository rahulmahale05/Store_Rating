import db from "../config/db.js";
import bcrypt from "bcryptjs";

export const addVendor = async (req, res) => {
  const { ownerName, storeName, storeId, storeAddress, password } = req.body;

  // Validate all fields including password
  if (!ownerName || !storeName || !storeId || !storeAddress || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO vendors (ownerName, storeName, storeId, storeAddress, password) VALUES (?, ?, ?, ?, ?)",
      [ownerName, storeName, storeId, storeAddress, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Store ID already exists" });
          }
          return res.status(500).json(err);
        }
        res.json({
          message: "Vendor registered successfully",
          vendorId: result.insertId,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error registering vendor", error });
  }
};

export const loginVendor = (req, res) => {
  const { storeId, password } = req.body;

  if (!storeId || !password) {
    return res.status(400).json({ message: "Store ID and password are required" });
  }

  db.query("SELECT * FROM vendors WHERE storeId = ?", [storeId], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const vendor = results[0];

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // You can customize what info to send back
    res.json({
      message: "Login successful",
      vendor: {
        id: vendor.id,
        ownerName: vendor.ownerName,
        storeName: vendor.storeName,
        storeId: vendor.storeId,
        storeAddress: vendor.storeAddress,
        rating: vendor.rating,
      },
    });
  });
};

export const getVendors = (req, res) => {
  db.query("SELECT * FROM vendors", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

export const getVendorById = (req, res) => {
  const { storeId } = req.params;
  db.query("SELECT * FROM vendors WHERE storeId = ?", [storeId], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: "Vendor not found" });
    res.json(results[0]);
  });
};

export const rateVendor = (req, res) => {
  const { storeId } = req.params;
  const { rating, userId } = req.body;

  if (rating == null || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  db.query(
    "UPDATE vendors SET rating = ? WHERE storeId = ?",
    [rating, storeId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      db.query(
        `INSERT INTO vendor_ratings (vendorId, userId, rating)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
        [storeId, userId, rating],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Rating submitted successfully", rating });
        }
      );
    }
  );
};

export const getVendorAverageRating = (req, res) => {
  const { vendorId } = req.params;

  const avgQuery = `
    SELECT AVG(rating) AS averageRating
    FROM vendor_ratings
    WHERE vendorId = ?
  `;

  db.query(avgQuery, [vendorId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result[0]); // { averageRating: 4.2 }
  });
};

// controllers/vendorController.js
export const getUserRating = (req, res) => {
  const { vendorId, userId } = req.params;

  const query = `
    SELECT rating 
    FROM vendor_ratings 
    WHERE vendorId = ? AND userId = ?
    LIMIT 1
  `;

  db.query(query, [vendorId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      res.json({ rating: results[0].rating });
    } else {
      res.json({ rating: 0 }); // return 0 if user hasn't rated yet
    }
  });
};

export const changeVendorPassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  db.query("SELECT * FROM vendors WHERE storeId = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    if (results.length === 0)
      return res.status(400).json({ message: "Vendor not found" });

    const vendor = results[0];
    const isMatch = await bcrypt.compare(oldPassword, vendor.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.query(
      "UPDATE vendors SET password = ? WHERE storeId = ?",
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

export const getUsersByStore = async (req, res) => {
  const { storeId } = req.params;

  db.query(
    `SELECT u.id, u.name, u.email, u.address, vr.rating, vr.created_at
     FROM users u
     JOIN vendor_ratings vr ON u.id = vr.userId
     JOIN vendors v ON vr.vendorId = v.id
     WHERE v.storeId = ?`,
    [storeId],
    (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ error: "Failed to fetch users" });
      }

      res.json(results);
    }
  );
};