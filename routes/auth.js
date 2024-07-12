const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// GET login page
router.get("/login", (req, res) => {
  res.render("login"); // Example rendering a login form
});

// After logging in, redirect to the dashboard
router.post("/login", authController.login, (req, res) => {
  res.redirect("/dashboard");
});

// GET register page
router.get("/register", (req, res) => {
  res.render("register"); // Example rendering a register form
});

// After registering, redirect to the dashboard
router.post("/register", authController.register, (req, res) => {
  res.redirect("/dashboard");
});

// Logout
router.get('/logout', authController.logout);

module.exports = router;
