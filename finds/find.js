const characterModel = require("../models/character");

const searchCharacters = async (req, res) => {
    const {keyword} = req.query;

    if (!keyword) {
        return res.status(400).json({ message: "Please provide a correct keyword for search"});
    }

    try { 
        const characters = await characterModel.find({
            $or: [
                {name: { $regex: `^${keyword}$`, $options: "i"}},
                {gender: { $regex: `^${keyword}$`, $options: "i"}}
            ]
        });
        res.status(200).json(characters);
    } catch (error) {
        res.status(500).json();
    }
};

module.exports = { searchCharacters };