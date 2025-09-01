import db from "../config/db.js";

export const getDashboardStats = (req, res) => {
  let stats = {};

  db.query("SELECT COUNT(*) AS totalVendors FROM vendors", (err, vendorResult) => {
    if (err) return res.status(500).json(err);
    stats.totalVendors = vendorResult[0].totalVendors;

    db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, userResult) => {
      if (err) return res.status(500).json(err);
      stats.totalUsers = userResult[0].totalUsers;

      db.query("SELECT COUNT(*) AS totalRatings FROM vendor_ratings", (err, ratingResult) => {
        if (err) return res.status(500).json(err);
        stats.totalRatings = ratingResult[0].totalRatings;

        res.json(stats);
      });
    });
  });
};
