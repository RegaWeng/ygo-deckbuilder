const pool = require('../db.js');

const deleteMe = async (req, res) => {
    try {
        const result = await pool.query('SELECT role FROM users WHERE id = $1', [req.accountId]);
        const user = result.rows[0];

        if (user && user.role === 'super_admin') {
            return res.status(400).json({ error: 'Admin accounts cannot self-delete. Ask another admin to remove your account.' });
        }

        await pool.query('DELETE FROM users WHERE id = $1', [req.accountId]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { deleteMe };