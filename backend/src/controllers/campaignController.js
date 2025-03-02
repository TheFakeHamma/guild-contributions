const pool = require("../config/db");

const getCampaignProgress = async (req, res) => {
    try {
        const { user_id } = req.params;
        const result = await pool.query(
            "SELECT * FROM campaign_progress WHERE user_id = $1",
            [user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No campaign progress found for this user" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getCampaignProgress };
