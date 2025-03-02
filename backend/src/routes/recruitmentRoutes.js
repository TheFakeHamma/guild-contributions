
const express = require("express");
const { recruitPlayer, markRecruitRaid, deleteRecruit, getUserRecruits } = require("../controllers/recruitmentController");

const router = express.Router();

router.post("/recruit", recruitPlayer);
router.get("/user/:id", getUserRecruits);
router.post("/recruit/raid", markRecruitRaid); // ✅ Mark raid participation
router.delete("/recruit/remove", deleteRecruit);

module.exports = router;
