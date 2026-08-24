const pool = require('../db.js');

const deleteDeck = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM decks
            WHERE id = $1 AND user_id = $2
            RETURNING id`,
            [id, req.accountId]
        );

        const deletedDeck = result.rows[0];

        if (!deletedDeck) {
            return res.status(404).json({ error: 'Deck not found' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { deleteDeck };