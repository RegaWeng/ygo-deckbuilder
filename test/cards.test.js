const { escapeRegex } = require('../controllers/cards.js');

test('escapes regex special characters', () => {
    expect(escapeRegex('a.b*c')).toBe('a\\.b\\*c');
});