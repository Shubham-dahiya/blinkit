const express = require("express");
const router = express.Router();

const { login, register, dashboard, getAllImages } = require("../controllers/user");
const authMiddleware = require('../middleware/auth')

// User Authentication Routes
router.post("/login", login); // User login
router.post("/register", register); // User registration

// User Dashboard Routes
router.post("/dashboard", authMiddleware, dashboard); // Fetch user dashboard data

// User Management Routes
router.get("/images", getAllImages); // Fetch all images


module.exports = router;