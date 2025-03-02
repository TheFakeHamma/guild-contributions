const express = require("express");
const { getAllUsers, getUserById, registerUser } = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.get("/all", getAllUsers);
router.get("/:id", getUserById);

module.exports = router;
