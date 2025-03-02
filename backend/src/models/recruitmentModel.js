const pool = require("../config/db");

const addRecruit = async (recruiter_id, recruit_name, recruit_type) => {
    const points = recruit_type === "main" ? 2 : 1; // ✅ Main gets 2 points, Alt gets 1
    const result = await pool.query(
        "INSERT INTO recruitments (recruiter_id, recruit_name, recruit_type) VALUES ($1, $2, $3) RETURNING *",
        [recruiter_id, recruit_name, recruit_type]
    );

    await pool.query(
        "INSERT INTO history_log (user_id, action) VALUES ($1, $2)",
        [recruiter_id, `Recruited ${recruit_name} (${recruit_type})`]
    );

    return result.rows[0];
};

const markRaidParticipation = async (recruit_id, recruiter_id) => {
    await pool.query("UPDATE recruitments SET participated_in_raid = TRUE WHERE id = $1", [recruit_id]);

    await pool.query("INSERT INTO history_log (user_id, action) VALUES ($1, $2)", [
        recruiter_id,
        `Recruit participated in a raid`,
    ]);

    return true;
};

const removeRecruit = async (recruit_id, recruiter_id, recruit_name, points_lost) => {
    await pool.query("DELETE FROM recruitments WHERE id = $1", [recruit_id]);

    await pool.query("INSERT INTO history_log (user_id, action) VALUES ($1, $2)", [
        recruiter_id,
        `Recruit ${recruit_name} left, -${points_lost} points removed`,
    ]);

    return true;
};
module.exports = { addRecruit, markRaidParticipation, removeRecruit };
