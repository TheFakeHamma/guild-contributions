const pool = require("../config/db");

const createUser = async (username, discord_id) => {
    const result = await pool.query(
        "INSERT INTO users (username, discord_id) VALUES ($1, $2) RETURNING *",
        [username, discord_id]
    );
    return result.rows[0];
};

const getUserByDiscordId = async (discord_id) => {
    const result = await pool.query("SELECT * FROM users WHERE discord_id = $1", [discord_id]);
    return result.rows[0];
};

module.exports = { createUser, getUserByDiscordId };
