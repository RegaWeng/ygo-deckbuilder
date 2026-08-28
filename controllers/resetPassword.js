const bcrypt = require('bcryptjs');
const pool = require('../db.js');

const resetPassword = async (req, res) => {
    const { reset_token, newPassword } = req.body;

    try {
        const result = await pool.query(
            'SELECT id, reset_token_expires FROM users WHERE reset_token = $1',
            [reset_token]
        );

        const account = result.rows[0];
        if (!account || new Date(account.reset_token_expires) < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const newHash = await bcrypt.hash(newPassword, 10);

        await pool.query(
            'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
            [newHash, account.id]
        );

        res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { resetPassword };