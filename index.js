// //**State down the tools that will be using*/
// const mongoose = require('mongoose');
// const express = require('express');
// const app = express();
// app.use(express.json()); //Ensure Json parsing middleware is used
// app.use(express.static('public'));
// require('dotenv').config();

// // const port = process.env.PORT;
// const port = parseInt(process.env.PORT) || 3000;
// const uri = process.env.MONGO_URI;

// const router = require('./routes/router');
// app.use('/', router);

// mongoose.connect(uri).then(() => {
//     console.log('connected to the database');
//     app.listen(port, () => {
//         console.log(`server running on ${port}`)
//     });
// });

//Split into Server(Index.js) and App.js
const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

const port = parseInt(process.env.PORT) || 3000;
const uri = process.env.MONGO_URI;

mongoose.connect(uri).then(() => {
    console.log('connected to the database');
    app.listen(port, () => {
        console.log(`server running on ${port}`);
    });
});
