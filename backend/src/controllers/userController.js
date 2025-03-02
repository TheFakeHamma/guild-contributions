const pool = require("../config/db");
const { createUser, getUserByDiscordId } = require("../models/userModel");

const registerUser = async (req, res) => {
    try {
        const { username, discord_id } = req.body;
        const existingUser = await getUserByDiscordId(discord_id);
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = await createUser(username, discord_id);
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, username FROM users ORDER BY username ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT id, username FROM users WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getUserById, getAllUsers, registerUser };
