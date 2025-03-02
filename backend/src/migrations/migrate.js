const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, "init.sql"), "utf-8");
        await pool.query(sql);
        console.log("✅ Migrations applied successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        pool.end();
    }
}

runMigrations();
