const pool = require('../db.js');

const updateDeck = async (req, res) => {
    const { id } = req.params;
    const { deck_name, format } = req.body;

    try {
        const result = await pool.query(
            `UPDATE decks
            SET deck_name = $1, format = $2
            WHERE id = $3 AND user_id = $4
            RETURNING id, deck_name, format, created_at`,
            [deck_name, format, id, req.accountId]
        );

        const updatedDeck = result.rows[0];

        if (!updatedDeck) {
            return res.status(404).json({ error: 'Deck not found' });
        }

        res.status(200).json(updatedDeck);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { updateDeck };