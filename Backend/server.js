import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/users", userRoutes);
app.use("/vendors", vendorRoutes);
app.use("/", ratingRoutes);

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
