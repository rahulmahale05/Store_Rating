import express from "express";
import { getDashboardStats } from "../controllers/ratingController.js";

const router = express.Router();

router.get("/dashboard-stats", getDashboardStats);

export default router;
