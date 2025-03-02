const express = require("express");
const { recruitPlayer, getUserRecruits } = require("../controllers/recruitmentController");

const router = express.Router();

router.post("/recruit", recruitPlayer);
router.get("/user/:id", getUserRecruits);

module.exports = router;
