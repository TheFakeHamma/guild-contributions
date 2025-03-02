const pool = require("../config/db");

const updateCampaignProgress = async (user_id, points) => {
    // Fetch current points
    const currentPointsResult = await pool.query(
        "SELECT points FROM campaign_progress WHERE user_id = $1",
        [user_id]
    );

    let currentPoints = currentPointsResult.rows.length > 0 ? parseFloat(currentPointsResult.rows[0].points) : 0;
    const newPoints = currentPoints + points;

    // Ensure no NaN values
    const finalPoints = isNaN(newPoints) ? 0 : newPoints;

    await pool.query(
        `INSERT INTO campaign_progress (user_id, points) 
         VALUES ($1, $2) 
         ON CONFLICT (user_id) DO UPDATE 
         SET points = EXCLUDED.points`,
        [user_id, finalPoints]
    );

    return finalPoints; // Return the updated points
};

// Fetch user's total points
const getUserCampaignPoints = async (user_id) => {
    const result = await pool.query(
        "SELECT points FROM campaign_progress WHERE user_id = $1",
        [user_id]
    );

    return result.rows.length > 0 ? parseFloat(result.rows[0].points) : 0;
};

module.exports = { updateCampaignProgress, getUserCampaignPoints };
