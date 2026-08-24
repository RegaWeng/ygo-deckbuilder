const pool = require ('../db.js');

const createDeck = async (req, res) => {
    const { deck_name, format } = req.body;

    try{
        const result = await pool.query(
            `INSERT INTO decks (user_id, deck_name, format)
            VALUES ($1, $2, $3)
            RETURNING id, deck_name, format, created_at`,
            [req.accountId, deck_name, format]
        );

        const newDeck = result.rows[0];
        res.status(201).json(newDeck);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

};

module.exports = { createDeck };