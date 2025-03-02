const express = require("express");
const { getAllUsers, registerUser } = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.get("/all", getAllUsers);

module.exports = router;
