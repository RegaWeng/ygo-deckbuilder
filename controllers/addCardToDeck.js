const pool = require('../db.js');
const cardModel = require('../models/card.js');

const addCardToDeck = async (req, res) => {
    const { id } = req.params;
    const { card_id, section, quantity = 1 } = req.body;

    try {
        const deckResult = await pool.query(
            'SELECT id FROM decks WHERE id = $1 AND user_id = $2',
            [id, req.accountId]
        );

        if (!deckResult.rows[0]) {
            return res.status(404).json({ error: 'Deck not found' });
        }

        const card = await cardModel.findById(Number(card_id));

        if (!card) {
            return res.status(400).json({ error: 'Invalid card_id — no such card' });
        }

        const insertResult = await pool.query(
            `INSERT INTO deck_cards (deck_id, card_id, section, quantity)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (deck_id, card_id, section)
             DO UPDATE SET quantity = deck_cards.quantity + EXCLUDED.quantity
             RETURNING *`,
            [id, card_id, section, quantity]
        );

        res.status(201).json(insertResult.rows[0]);
    } catch (err) {
        if (err.code === '23514') {
            return res.status(409).json({ error: 'Adding this many would exceed the 3-copy limit' });
        }
        res.status(400).json({ error: err.message });
    }
};

module.exports = { addCardToDeck };