// controllers/getMe.js
const pool = require('../db.js');

const getMe = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, email, role FROM users WHERE id = $1',
            [req.accountId]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getMe };