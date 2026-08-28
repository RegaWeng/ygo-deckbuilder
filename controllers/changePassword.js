const bcrypt = require('bcryptjs');
const pool = require('../db.js');

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const result = await pool.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [req.accountId]
        );

        const account = result.rows[0];
        if (!account) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatches = await bcrypt.compare(currentPassword, account.password_hash);
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const newHash = await bcrypt.hash(newPassword, 10);

        await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [newHash, req.accountId]
        );

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { changePassword };