const pool = require('../db.js');

const removeCardFromDeck = async (req, res) => {
    const { id, cardId } = req.params;
    const { section } = req.body;

    try {
        const deckResult = await pool.query(
            'SELECT id FROM decks WHERE id = $1 AND user_id = $2',
            [id, req.accountId]
        );

        if (!deckResult.rows[0]) {
            return res.status(404).json({ error: 'Deck not found'});
        }

        const result = await pool.query(
            `DELETE FROM deck_cards
            WHERE deck_id = $1 AND card_id = $2 AND section = $3
            RETURNING deck_id`,
            [id, cardId, section]
        );

        if (!result.rows[0]) {
            return res.status(404).json({ error: 'Card not found in this deck'});
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { removeCardFromDeck };