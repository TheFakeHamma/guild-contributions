const express = require("express");
const { addContributionHandler, getUserContributionsHandler, removeContributionHandler } = require("../controllers/contributionController");
const router = express.Router();

router.post("/contribute", addContributionHandler);
router.get("/user/:id", getUserContributionsHandler);
router.delete("/remove", removeContributionHandler);

module.exports = router;
