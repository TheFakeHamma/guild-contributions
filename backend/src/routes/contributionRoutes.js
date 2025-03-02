const express = require("express");
const { addContributionHandler, getUserContributions } = require("../controllers/contributionController");

const router = express.Router();

router.post("/contribute", addContributionHandler);
router.get("/user/:id", getUserContributions);

module.exports = router;
