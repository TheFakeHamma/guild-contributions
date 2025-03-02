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

module.exports = { addContributionHandler }; // Ensure this is exported
