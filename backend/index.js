require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const pool = require("./src/config/db");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
    res.send("Powerhouse Backend is running!");
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ message: "Database connected!", time: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection failed" });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
