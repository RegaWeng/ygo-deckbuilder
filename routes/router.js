const express = require('express');
const router = express.Router();

const { signup } = require('../controllers/signup.js');
const { login } = require('../controllers/login.js');
const { changePassword } = require('../controllers/changePassword.js');
const { requestPasswordReset } = require('../controllers/requestPasswordReset.js');
const { resetPassword } = require('../controllers/resetPassword.js');

const { createDeck } = require('../controllers/createDeck.js');
const { updateDeck } = require('../controllers/updateDeck.js');
const { deleteDeck } = require('../controllers/deleteDeck.js');
const { getAllDecksForUser } = require('../controllers/getAllDecksForUser.js');
const { getDeckById } = require('../controllers/getDeckById.js');
const { addCardToDeck } = require('../controllers/addCardToDeck.js');
const { patchDeck } = require('../controllers/patchDeck.js');
const { healthCheck } = require('../controllers/healthCheck.js');

const { getCardById, searchCards } = require('../controllers/cards.js');
const { removeCardFromDeck } = require('../controllers/removeCardFromDeck.js');

const { requireAuth } = require('../middleware/auth.js');
const { getMe } = require('../controllers/getMe.js');
const { deleteMe } = require('../controllers/deleteMe.js');
const { listUsers } = require('../controllers/listUsers.js');
const { updateUserRole } = require('../controllers/updateUserRole.js');
const { deleteUserByAdmin } = require('../controllers/deleteUserByAdmin.js');
const { requireRole } = require('../middleware/role.js');


// Auth
router.post('/register', signup);
router.post('/login', login);
router.put('/change-password', requireAuth, changePassword);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

router.get('/me', requireAuth, getMe);
router.delete('/me', requireAuth, deleteMe);

router.get('/users', requireAuth, requireRole(['super_admin']), listUsers);
router.put('/users/:id/role', requireAuth, requireRole(['super_admin']), updateUserRole);
router.delete('/users/:id', requireAuth, requireRole(['super_admin']), deleteUserByAdmin);

// Cards (public, catalog is read-only via API — search route MUST come before :id)
router.get('/cards/search', searchCards);
router.get('/cards/:id', getCardById);


// Decks (all owned, all require auth)
router.get('/decks', requireAuth, getAllDecksForUser);
router.post('/decks', requireAuth, createDeck);
router.get('/decks/:id', requireAuth, getDeckById);
router.put('/decks/:id', requireAuth, updateDeck);
router.delete('/decks/:id', requireAuth, deleteDeck);
router.post('/decks/:id/cards', requireAuth, addCardToDeck);
router.delete('/decks/:id/cards/:cardId', requireAuth, removeCardFromDeck);
router.patch('/decks/:id', requireAuth, patchDeck);
router.get('/health', healthCheck);

module.exports = router;