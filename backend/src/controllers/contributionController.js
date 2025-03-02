const pool = require("../config/db");

const { addContribution } = require("../models/contributionModel");
const { updateCampaignProgress } = require("../models/campaignModel");

const addContributionHandler = async (req, res) => {
    try {
        const { user_id, item_name, quantity, points_awarded } = req.body;
        const contribution = await addContribution(user_id, item_name, quantity, points_awarded);
        await updateCampaignProgress(user_id, points_awarded);
        res.status(201).json(contribution);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getUserContributions = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT item_name, quantity, points_awarded FROM contributions WHERE user_id = $1 ORDER BY created_at DESC",
            [id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { addContributionHandler, getUserContributions };
