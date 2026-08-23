const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/data', (req, res) => {
    res.json({ message: "Security fetched."});
});

app.listen(3000,() => console.log('Server running on http://localhost:3000'));