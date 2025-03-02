const express = require("express");
const { addContributionHandler } = require("../controllers/contributionController"); // Fix the import

const router = express.Router();

router.post("/contribute", addContributionHandler);

module.exports = router;
