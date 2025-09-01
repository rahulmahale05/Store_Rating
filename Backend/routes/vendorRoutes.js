import express from "express";
import { addVendor, getVendors, getVendorById, rateVendor, getVendorAverageRating, getUserRating, loginVendor, changeVendorPassword, getUsersByStore    } from "../controllers/vendorController.js";

const router = express.Router();

router.post("/", addVendor);
router.get("/", getVendors);
router.post("/change-password", changeVendorPassword);
router.post("/login", loginVendor);
router.get("/:storeId", getVendorById);
router.post("/:storeId/rate", rateVendor);
router.get("/:storeId/users", getUsersByStore);
router.get("/:vendorId/average-rating", getVendorAverageRating);
router.get("/:vendorId/user-rating/:userId", getUserRating);

export default router;
