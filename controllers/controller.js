//**This JS file are connected with model.js folder and responsible for sending status code when the function call back is working or not */

const characterModel  = require("../models/character");

const getAll = async(req, res) =>{
    try {
        const characters = await characterModel.find();
        res.status(200).json(characters);
    } catch (error) {
        res.status(500).json();
    }
}

const createCharacter = async (req, res) => {
    const newCharacter = new characterModel(req.body);
    try {
        const savedCharacter = await newCharacter.save();
        res.status(201).json(savedCharacter);
    } catch (err) {
        res.status(400).send();
    }
};

const updateCharacter = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedCharacter = await characterModel.findByIdAndUpdate(id, updateData, {
        new: true, // Return the updated document
        runValidators: true // Validate before updating
        });

    if (!updatedCharacter) {//**If cannot update character */
        return res.status(404).send(`Character not found`);
    }

    res.json(updatedCharacter);
    } catch (err) {
        res.status(500).send();
    }
};

const deleteCharacter = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCharacter = await characterModel.findByIdAndDelete(id);

        if (!deletedCharacter) {
            return res.status(404).send('Character not found');
        }
        
        res.status(204).send();
    } catch (err) {
        res.status(500).send();
    }
};

const getCharacterById = async (req, res) => {
    const { id } = req.params; //1.grab the  id from the request;

    try {
        const character = await characterModel.findById(id); //ask Mongoose for that one product;

        if (!character) {
            return res.status(404).send('ID not found'); //3.Mongoose return null if nothing mathces
        }

        res.status(200).json(character); //4.found it so return it
    } catch (err) {
        res.status(500).send(); //5.something broke.
    }
};

module.exports = {getAll, createCharacter, updateCharacter, deleteCharacter, getCharacterById};