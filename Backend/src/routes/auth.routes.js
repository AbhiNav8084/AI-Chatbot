const express = require("express");
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")


const router = express.Router();

/* - POST /api/auth/register */
router.post("/register", authController.registerUser)

/* - POST /api/auth/login */
router.post("/login", authController.loginUser)

/* - GET /api/auth/me */
router.get("/me", authMiddleware.authUser, authController.getCurrentUser)

/* - POST /api/auth/logout */
router.post("/logout", authController.logoutUser)



module.exports = router; 
