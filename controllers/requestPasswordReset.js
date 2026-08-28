const crypto = require('crypto');
const pool = require('../db.js');

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        const account = result.rows[0];

        if (!account) {
            return res.status(200).json({ message: 'If that email exists, a reset token has been issued.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
            [token, expires, account.id]
        );

        res.status(200).json({ message: 'Reset token generated (email mocked for demo)', reset_token: token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { requestPasswordReset };