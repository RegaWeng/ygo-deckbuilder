//**This JS are importing getAll function from controller js */
const { getAll, createCharacter, updateCharacter, deleteCharacter, getCharacterById } = require(`../controllers/controller.js`);
const { searchCharacters } = require('../finds/find.js');
const express = require('express');

const router = express.Router();
const { signup } = require('../controllers/signup.js');
const { login } = require('../controllers/jwt.js');
const { requireRole } = require('../middleware/role.js');
const { requireAuth } = require('../middleware/auth.js');


router.get("/", getAll);
router.get("/characters/search", searchCharacters);

router.post("/characters", requireAuth, requireRole(['worker', 'super_admin']), createCharacter);
router.put("/characters/:id", requireAuth, requireRole(['worker', 'super_admin']), updateCharacter); 
router.patch("/characters/:id", requireAuth, requireRole(['worker', 'super_admin']), updateCharacter);
router.delete("/characters/:id", requireAuth, requireRole(['worker', 'super_admin']), deleteCharacter);

router.get("/characters/:id", getCharacterById);
router.post('/register', signup);
router.post('/login', login);
router.get('/protected', requireAuth, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

module.exports = router;