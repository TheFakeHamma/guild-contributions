const pool = require("../config/db");

const addRecruit = async (recruiter_id, recruit_name) => {
    const result = await pool.query(
        "INSERT INTO recruitments (recruiter_id, recruit_name, recruit_level) VALUES ($1, $2, 80) RETURNING *",
        [recruiter_id, recruit_name]
    );
    return result.rows[0];
};

module.exports = { addRecruit };
