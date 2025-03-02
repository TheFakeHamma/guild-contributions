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

module.exports = { recruitPlayer };
