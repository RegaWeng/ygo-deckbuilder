const bcrypt = require('bcryptjs');
const pool = require('../db.js'); //pool from db.js

const signup = async (req, res) => {
    const { username, password, email, phone, address } = req.body;

    try {
        const harshedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query( // replaced new accountModel(...).save() with one INSERt
            `INSERT INTO users (username, password_hash, email, phone, address)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username`,
            [username, harshedPassword, email, phone, address]
        );

        const savedAccount = result.rows[0]; //Postgres always return results as an array of rows at index 0
        res.status(201).json({ username: savedAccount.username });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        res.status(400).json({ error: err.message });
    }
};

module.exports = { signup };