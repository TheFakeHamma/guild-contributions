const pool = require("../config/db");

const addContribution = async (user_id, item_name, quantity, points_awarded) => {
    const result = await pool.query(
        "INSERT INTO contributions (user_id, item_name, quantity, points_awarded) VALUES ($1, $2, $3, $4) RETURNING *",
        [user_id, item_name, quantity, points_awarded]
    );
    return result.rows[0];
};

module.exports = { addContribution };
