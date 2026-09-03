const { connectRabbit } = require('../config/rabbitmq.js');
const pool = require('../db.js');

const MAIN_MIN = 40, MAIN_MAX = 60, EXTRA_MAX = 15, SIDE_MAX = 15;

const validateDeck = async (deckId) => {
    const result = await pool.query(
        `SELECT section, SUM(quantity) as total
         FROM deck_cards WHERE deck_id = $1 GROUP BY section`,
        [deckId]
    );

    const totals = { main: 0, extra: 0, side: 0 };
    result.rows.forEach(row => { totals[row.section] = Number(row.total); });

    let status = 'valid';
    let message = 'Deck meets construction rules.';

    if (totals.main < MAIN_MIN || totals.main > MAIN_MAX) {
        status = 'invalid';
        message = `Main deck has ${totals.main} cards (must be ${MAIN_MIN}-${MAIN_MAX}).`;
    } else if (totals.extra > EXTRA_MAX) {
        status = 'invalid';
        message = `Extra deck has ${totals.extra} cards (max ${EXTRA_MAX}).`;
    } else if (totals.side > SIDE_MAX) {
        status = 'invalid';
        message = `Side deck has ${totals.side} cards (max ${SIDE_MAX}).`;
    }

    await pool.query(
        'UPDATE decks SET validation_status = $1, validation_message = $2 WHERE id = $3',
        [status, message, deckId]
    );

    console.log(`Deck ${deckId} validated: ${status}`);
};

const start = async () => {
    const channel = await connectRabbit();
    channel.prefetch(1);

    channel.consume('validate_deck', async (msg) => {
        if (!msg) return;
        try {
            const { deck_id } = JSON.parse(msg.content.toString());
            await validateDeck(deck_id);
            channel.ack(msg);
        } catch (err) {
            console.error('Validation failed:', err.message);
            channel.nack(msg, false, false);
        }
    });

    console.log('Worker listening for validate_deck messages...');
};

start();