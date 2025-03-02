const express = require("express");
const { addContributionHandler, getUserContributionsHandler } = require("../controllers/contributionController");

const router = express.Router();

router.post("/contribute", addContributionHandler);
router.get("/user/:id", getUserContributionsHandler);

module.exports = router;
