const pool = require("../config/db");

// Function to get the correct amount for the item from JSON
const contributionData = require("../data/contributions.json");

const findAmountForItem = (item_name) => {
    const item = contributionData.find((i) => i.name === item_name);
    return item ? item.amount : 1; // Default to 1 if not found (just in case)
};

const addContribution = async (user_id, item_name, quantity, points_awarded) => {
    const amount = findAmountForItem(item_name);

    const result = await pool.query(
        "INSERT INTO contributions (user_id, item_name, quantity, amount, points_awarded) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [user_id, item_name, quantity, amount, points_awarded]
    );
    return result.rows[0];
};

const getUserContributions = async (user_id) => {
    const result = await pool.query(
        "SELECT item_name, quantity, amount, points_awarded FROM contributions WHERE user_id = $1 ORDER BY created_at DESC",
        [user_id]
    );
    return result.rows;
};

module.exports = { addContribution, getUserContributions };
