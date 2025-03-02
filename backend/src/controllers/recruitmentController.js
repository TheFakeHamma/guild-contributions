const pool = require("../config/db");

const { addRecruit, markRaidParticipation, removeRecruit } = require("../models/recruitmentModel");
const { updateCampaignProgress, getUserCampaignPoints } = require("../models/campaignModel");

const recruitPlayer = async (req, res) => {
    try {
        const { recruiter_id, recruit_name, recruit_type } = req.body;
        const recruit = await addRecruit(recruiter_id, recruit_name, recruit_type);

        const points = recruit_type === "main" ? 2 : 1;
        const updatedPoints = await updateCampaignProgress(recruiter_id, points);

        res.status(201).json({ recruit, updatedPoints });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getUserRecruits = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT id, recruit_name, recruit_type, participated_in_raid FROM recruitments WHERE recruiter_id = $1 ORDER BY created_at DESC",
            [id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllRecruits = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT r.id, r.recruit_name, r.recruit_type, r.participated_in_raid, 
                    u.id AS recruiter_id, u.username AS recruiter_name
             FROM recruitments r
             JOIN users u ON r.recruiter_id = u.id
             ORDER BY r.created_at DESC`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const markRecruitRaid = async (req, res) => {
    try {
        const { recruit_id, recruiter_id } = req.body;

        // Ensure recruit isn't already marked
        const recruitCheck = await pool.query(
            "SELECT participated_in_raid FROM recruitments WHERE id = $1",
            [recruit_id]
        );

        if (recruitCheck.rows[0].participated_in_raid) {
            return res.status(400).json({ message: "Recruit already marked as participated" });
        }

        await markRaidParticipation(recruit_id, recruiter_id);
        const updatedPoints = await updateCampaignProgress(recruiter_id, 5);

        res.status(200).json({ message: "Recruit marked as participated in a raid", updatedPoints });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteRecruit = async (req, res) => {
    try {
        const { recruit_id, recruiter_id, recruit_name, points_lost } = req.body;

        if (!recruit_id || !recruiter_id || !points_lost) {
            return res.status(400).json({ message: "Missing required data" });
        }

        const recruit = await pool.query("SELECT * FROM recruitments WHERE id = $1", [recruit_id]);
        if (recruit.rowCount === 0) {
            return res.status(404).json({ message: "Recruit not found" });
        }

        await removeRecruit(recruit_id, recruiter_id, recruit_name, points_lost);
        const updatedPoints = await updateCampaignProgress(recruiter_id, -points_lost);

        res.status(200).json({ message: "Recruit removed and points deducted", updatedPoints });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getAllRecruits, getUserRecruits, recruitPlayer, markRecruitRaid, deleteRecruit };
