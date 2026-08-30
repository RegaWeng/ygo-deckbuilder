const pool = require('../db.js');
const cardModel = require('../models/card.js');

const getDeckById = async (req, res) => {
    const { id } = req.params;

    try {
        const deckResult = await pool.query(
            'SELECT * FROM decks WHERE id = $1 AND user_id = $2',
            [id, req.accountId]
        );

        const deck = deckResult.rows[0];

        if (!deck) {
            return res.status(404).json({ error: 'Deck not found' });
        }

        const cardRows = await pool.query(
            'SELECT card_id, section, quantity FROM deck_cards WHERE deck_id = $1',
            [id]
        );

        const cards = await Promise.all(
            cardRows.rows.map(async (row) => {
                const cardDetails = await cardModel.findById(Number(row.card_id));

                return {
                    section: row.section,
                    quantity: row.quantity,
                    card: cardDetails ? {
                        id: cardDetails.id,
                        name: cardDetails.name,
                        type: cardDetails.type,
                        race: cardDetails.race,
                        attribute: cardDetails.attribute,
                        atk: cardDetails.atk,
                        def: cardDetails.def,
                        level: cardDetails.level,
                        desc: cardDetails.desc,
                        image_url: cardDetails.card_images?.[0]?.image_url_small,
                    } : null,
                };
            })
        );

        res.status(200).json({ ...deck, cards });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getDeckById };