const pool = require("../config/db");

const updateCampaignProgress = async (user_id, points) => {
    await pool.query(
        "INSERT INTO campaign_progress (user_id, points) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET points = campaign_progress.points + EXCLUDED.points",
        [user_id, points]
    );
};

module.exports = { updateCampaignProgress };
