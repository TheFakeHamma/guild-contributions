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
        "SELECT id, item_name, quantity, amount, points_awarded FROM contributions WHERE user_id = $1 ORDER BY created_at DESC",
        [user_id]
    );

    console.log("📥 Contributions Fetched:", result.rows); // ✅ Debugging
    return result.rows;
};

const removeContribution = async (contribution_id, user_id) => {
    // ✅ Check if the contribution exists first
    const result = await pool.query(
        "SELECT points_awarded FROM contributions WHERE id = $1 AND user_id = $2",
        [contribution_id, user_id]
    );

    if (result.rows.length === 0) {
        throw new Error("❌ Contribution not found"); // ✅ Prevents deleting non-existent contributions
    }

    const pointsToDeduct = result.rows[0].points_awarded;

    // ✅ Delete the contribution
    await pool.query("DELETE FROM contributions WHERE id = $1", [contribution_id]);

    // ✅ Log the removal in history
    await pool.query("INSERT INTO history_log (user_id, action) VALUES ($1, $2)", [
        user_id,
        `Contribution removed, -${pointsToDeduct} points`,
    ]);

    return pointsToDeduct;
};

module.exports = { removeContribution, addContribution, getUserContributions };
