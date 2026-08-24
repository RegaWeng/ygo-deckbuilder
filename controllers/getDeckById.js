const pool = require('../db.js');

const getDeckById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM decks WHERE id = $1',
            [id]
        );

        const deck = result.rows[0];

        if (!deck) {
            return res.status(404).json({ error: 'Deck not found' });
        }

        if (deck.user_id !== req.accountId) {
            return res.status(403).json({ error: 'Not your deck' });
        }

        res.status(200).json(deck);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getDeckById };