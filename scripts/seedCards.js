const connectMongo = require('../config/mongo.js');
const Card = require('../models/card.js');

const seedCards = async () => {
    try {
        await connectMongo();

        console.log('Fetching card data from YGOPRODeck...');
        const response = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php');
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