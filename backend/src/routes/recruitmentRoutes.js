const express = require("express");
const { recruitPlayer, markRecruitRaid, deleteRecruit, getUserRecruits, getAllRecruits } = require("../controllers/recruitmentController");

const router = express.Router();

router.post("/recruit", recruitPlayer);
router.get("/user/:id", getUserRecruits);
router.get("/all", getAllRecruits);
router.post("/recruit/raid", markRecruitRaid);
router.delete("/recruit/remove", deleteRecruit);

module.exports = router;
