const express = require("express");
const { getCampaignProgress } = require("../controllers/campaignController");

const router = express.Router();

router.get("/progress/:user_id", getCampaignProgress);

module.exports = router;
