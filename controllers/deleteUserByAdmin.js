const pool = require('../db.js');

const deleteUserByAdmin = async (req, res) => {
    const { id } = req.params;

    if (Number(id) === req.accountId) {
        return res.status(400).json({ error: "Can't modify your own admin account through this endpoint" });
    }

    try {
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING id',
            [id]
        );

        if (!result.rows[0]) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { deleteUserByAdmin };