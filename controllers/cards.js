const cardModel = require('../models/card.js');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getCardById = async (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid card ID' });
    }

    try {
        const card = await cardModel.findById(numericId);

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.status(200).json(card);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const searchCards = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Please provide a search query' });
    }

    try {
        const normalizedQuery = q.toLowerCase().replace(/[^a-z0-9]/g, '');
        const safeQuery = escapeRegex(normalizedQuery);
        const results = await cardModel.find({
            name_normalized: { $regex: safeQuery, $options: 'i' }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getCardById, searchCards, escapeRegex };