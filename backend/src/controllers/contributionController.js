const pool = require("../config/db");
const { addContribution, getUserContributions, removeContribution } = require("../models/contributionModel");
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

const removeContributionHandler = async (req, res) => {
    try {
        const { contribution_id, user_id } = req.query; // Make sure it's received

        console.log("🛠 Received Request to Remove Contribution:");
        console.log("Contribution ID:", contribution_id);
        console.log("User ID:", user_id);

        if (!contribution_id) {
            console.error("❌ Missing contribution_id in request!");
            return res.status(400).json({ message: "Contribution ID is required" });
        }

        const contribution = await pool.query("SELECT * FROM contributions WHERE id = $1", [contribution_id]);
        if (contribution.rows.length === 0) {
            return res.status(404).json({ message: "Contribution not found" });
        }

        // Deduct points before deleting
        const pointsToDeduct = contribution.rows[0].points_awarded;
        await pool.query("DELETE FROM contributions WHERE id = $1", [contribution_id]);
        await updateCampaignProgress(user_id, -pointsToDeduct);

        console.log(`✅ Contribution ${contribution_id} removed successfully!`);

        return res.status(200).json({ message: "Contribution removed", contribution_id });
    } catch (error) {
        console.error("❌ Error removing contribution:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { removeContributionHandler, addContributionHandler, getUserContributionsHandler };
