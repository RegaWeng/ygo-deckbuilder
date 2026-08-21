const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const accountModel = require('../models/user.js');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const account = await accountModel.findOne({ username });
        if (!account) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatches = await bcrypt.compare(password, account.password);
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { accountId: account._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { login };
//Handle session/ token issuance.
// At login, the server signs a payload of accountID with a secret key= the token.
// Each request will direct to auth.js for verifies the signature  expiry by using the same secret.
