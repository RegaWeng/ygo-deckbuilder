const bcrypt = require('bcryptjs');
const accountModel = require('../models/user.js');

const signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAccount = new accountModel({ username, password: hashedPassword });
        const savedAccount = await newAccount.save();
        res.status(201).json({ username: savedAccount.username });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    
};

module.exports = { signup };
//Handle account creation.