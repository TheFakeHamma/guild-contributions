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

module.exports = { registerUser };
