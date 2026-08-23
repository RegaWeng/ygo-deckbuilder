const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db.js');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        const savedAccount = result.rows[0];//For Postgres, no more accountModel
        
                if (!savedAccount) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
        
                const passwordMatches = await bcrypt.compare(password, savedAccount.password_hash);
                if (!passwordMatches) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
        
                const token = jwt.sign(
                    { accountId: savedAccount.id },
                    process.env.JWT_SECRET,
                    { expiresIn: '15m' }
                );
        
                res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports ={ login };
//Handle session/ token issuance.
// At login, the server signs a payload of accountID with a secret key= the token.
// Each request will direct to auth.js for verifies the signature  expiry by using the same secret.
