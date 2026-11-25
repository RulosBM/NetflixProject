import express from "express";
import {
  signup,
  signin,
  getProfile,
  getMyList,
  addToMyList,
  removeFromMyList,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/profile", protect, getProfile);

// Endpoints protegidos para Mi Lista
router.get("/mylist", protect, getMyList);
router.post("/mylist/:movieId", protect, addToMyList);
router.delete("/mylist/:movieId", protect, removeFromMyList);

export default router;
