const express = require("express");
const { recruitPlayer } = require("../controllers/recruitmentController");
const router = express.Router();

router.post("/recruit", recruitPlayer);

module.exports = router;
