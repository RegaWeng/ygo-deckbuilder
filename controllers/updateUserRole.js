const pool = require('../db.js');

const ALLOWED_ROLES = ['user', 'worker', 'super_admin'];

const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (Number(id) === req.accountId) {
        return res.status(400).json({ error: "can't modify your own admin account through this endpoint"});
    }

    if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({ error: `role must be one of: ${ALLOWED_ROLES.join(', ')}` });
    }

    try {
        const result = await pool.query(
            'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role',
            [role, id]
        );

        if (!result.rows[0]) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { updateUserRole };