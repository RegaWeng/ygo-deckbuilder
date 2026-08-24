const pool = require('../db.js');

const getAllDecksForUser = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM decks
            WHERE user_id = $1`,
            [req.accountId]
        );

        const userDecks = result.rows;

        res.status(200).json(userDecks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllDecksForUser };