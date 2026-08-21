//**This js file are responsible to create the structure of schema */

const { mongoose } = require("mongoose");
const { v6: uuidv6 } = require('uuid');
const Schema = mongoose.Schema;

const characterSchema = new Schema({
    _id: { type: String, default: uuidv6},
    name:{ type:String, required: true },
    gender: { type: String, required: true },
    power: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const characterModel = mongoose.model('game', characterSchema);
module.exports = characterModel;