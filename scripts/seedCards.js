const connectMongo = require('../config/mongo.js');
const Card = require('../models/card.js');

const fetchWithTimeout = async (url, timeoutMs = 10000, retries = 2) => {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timer);
            return response;
        } catch (err) {
            clearTimeout(timer);
            if (attempt > retries) throw err;
            console.log(`Attempt ${attempt} failed, retrying...`);
        }
    }
};

const seedCards = async () => {
    try {
        await connectMongo();

        console.log('Fetching card data from YGOPRODeck...');
        const response = await fetchWithTimeout('https://db.ygoprodeck.com/api/v7/cardinfo.php');
        const { data } = await response.json();

        console.log(`Fetched ${data.length} cards. Inserting into MongoDB...`);

        const cardsWithId = data.map(card => ({
            ...card,
            _id: card.id,
            name_normalized: card.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        }));

        await Card.deleteMany({});
        await Card.insertMany(cardsWithId);

        console.log('Seed complete.');
        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exit(1);
    }
};

seedCards();