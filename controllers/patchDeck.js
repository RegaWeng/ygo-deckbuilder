// controllers/patchDeck.js
const pool = require('../db.js');

const patchDeck = async (req, res) => {
    const { id } = req.params;
    const { deck_name, format } = req.body;

    const fields = [];
    const values = [];
    let i = 1;

    if (deck_name !== undefined) { fields.push(`deck_name = $${i++}`); values.push(deck_name); }
    if (format !== undefined) { fields.push(`format = $${i++}`); values.push(format); }

    if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields provided to update' });
    }

    values.push(id, req.accountId);

    try {
        const result = await pool.query(
            `UPDATE decks SET ${fields.join(', ')} WHERE id = $${i++} AND user_id = $${i} RETURNING *`,
            values
        );
        if (!result.rows[0]) return res.status(404).json({ error: 'Deck not found' });
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { patchDeck };