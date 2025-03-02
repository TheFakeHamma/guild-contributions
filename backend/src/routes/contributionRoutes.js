const express = require("express");
const { addContributionHandler } = require("../controllers/contributionController");
const router = express.Router();

router.post("/contribute", addContributionHandler);

module.exports = router;
