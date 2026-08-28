const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({}, { strict: false, _id: false });
cardSchema.index({ name: 'text' });

const Card = mongoose.model('Card', cardSchema, 'cards');


module.exports = Card;