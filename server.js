const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/data', (req, res) => {
    res.json({ message: "Security fetched."});
});

app.listen(4000,() => console.log('Server running on http://localhost:4000'));