const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');
const { connectRabbit } = require('./config/rabbitmq.js');

const port = parseInt(process.env.PORT) || 3000;
const uri = process.env.MONGO_URI;

mongoose.connect(uri).then(() => {
    console.log('connected to the database');
    connectRabbit();
    app.listen(port, () => {
        console.log(`server running on ${port}`);
    });
});
