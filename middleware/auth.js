const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];   // format: "Bearer <token>"

    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];   // split "Bearer xyz" -> ["Bearer", "xyz"], take the token part

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.accountId = decoded.accountId;   // attach decoded info for the route handler to use
        next();                              // signature valid AND not expired -> continue
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired, please log in again' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = {requireAuth};

//if the catch block trigger, it will send back HTTP JSON response back to clients-side.
//without next(), the response leave hang= silence.
