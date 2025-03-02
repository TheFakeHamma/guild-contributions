const pool = require("../config/db");
const { addContribution, getUserContributions } = require("../models/contributionModel");
const { updateCampaignProgress } = require("../models/campaignModel");

// Ensure contribution saves the correct amount per item
const addContributionHandler = async (req, res) => {
    try {
        const { user_id, item_name, quantity, points_awarded } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        const contribution = await addContribution(user_id, item_name, quantity, points_awarded);
        await updateCampaignProgress(user_id, points_awarded);

        res.status(201).json(contribution);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getUserContributionsHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const contributions = await getUserContributions(id);
        res.status(200).json(contributions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { addContributionHandler, getUserContributionsHandler };
