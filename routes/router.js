const express = require('express');
const router = express.Router();

const { signup } = require('../controllers/signup.js');
const { login } = require('../controllers/login.js');
const { createDeck } = require('../controllers/createDeck.js');
const { updateDeck } = require('../controllers/updateDeck.js');
const { deleteDeck } = require('../controllers/deleteDeck.js');
const { getAllDecksForUser } = require('../controllers/getAllDecksForUser.js');
const { getDeckById } = require('../controllers/getDeckById.js');
const { requireAuth } = require('../middleware/auth.js');

router.post('/register', signup);
router.post('/login', login);

router.get('/decks', requireAuth, getAllDecksForUser);
router.post('/decks', requireAuth, createDeck);
router.get('/decks/:id', requireAuth, getDeckById);
router.put('/decks/:id', requireAuth, updateDeck);
router.delete('/decks/:id', requireAuth, deleteDeck);

module.exports = router;