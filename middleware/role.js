const jwt = require('jsonwebtoken');
const pool = require('../db.js');

const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const result = await pool.query(
                'SELECT role FROM users WHERE id = $1',
                [req.accountID]
            );

            const user = result.rows[0];

            if (!user) {
                return res.status(401).json({ error: 'User not found'});

                if (!allowedRoles.includes(user.role)) {
                    return res.status(403).json({ error: 'Insufficient permissions'});
                }

                next();
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        };
    };
};

module.exports = { requireRole };