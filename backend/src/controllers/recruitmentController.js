const pool = require("../config/db");

const { addRecruit } = require("../models/recruitmentModel");
const { updateCampaignProgress } = require("../models/campaignModel");

const recruitPlayer = async (req, res) => {
    try {
        const { recruiter_id, recruit_name } = req.body;
        const recruit = await addRecruit(recruiter_id, recruit_name);
        await updateCampaignProgress(recruiter_id, 2);
        res.status(201).json(recruit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getUserRecruits = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT recruit_name FROM recruitments WHERE recruiter_id = $1 ORDER BY created_at DESC",
            [id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { recruitPlayer, getUserRecruits };