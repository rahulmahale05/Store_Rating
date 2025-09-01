import express from "express";
import { registerUser, loginUser, getUsers, changePassword  } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", changePassword);
router.get("/", getUsers);

export default router;
