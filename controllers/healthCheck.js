// controllers/healthCheck.js
const pool = require('../db.js');
const mongoose = require('mongoose');

const healthCheck = async (req, res) => {
    const status = { service: 'ok', postgres: 'unknown', mongo: 'unknown' };
    try {
        await pool.query('SELECT 1');
        status.postgres = 'ok';
    } catch { status.postgres = 'error'; }

    status.mongo = mongoose.connection.readyState === 1 ? 'ok' : 'error';

    const allOk = status.postgres === 'ok' && status.mongo === 'ok';
    res.status(allOk ? 200 : 503).json(status);
};

module.exports = { healthCheck };