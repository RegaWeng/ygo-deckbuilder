//**This JS are importing getAll function from controller js */
// const getAll = require('../controllers/controller.js');
const { getAll, createCharacter, updateCharacter, deleteCharacter, getCharacterById } = require(`../controllers/controller.js`);
const { searchCharacters } = require('../finds/find.js');
const express = require('express');

const router = express.Router();
const { signup } = require('../controllers/signup.js');
const { login } = require('../controllers/jwt.js');
const { requireAuth } = require('../middleware/auth.js');

router.get("/", getAll);
router.get("/characters/search", searchCharacters);

router.post("/characters", requireAuth,createCharacter);
router.put("/characters/:id", requireAuth, updateCharacter); 
router.patch("/characters/:id", requireAuth, updateCharacter);
router.delete("/characters/:id", requireAuth, deleteCharacter);

router.get("/characters/:id", getCharacterById);
router.post('/register', signup);
router.post('/login', login);
router.get('/protected', requireAuth, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

module.exports = router;