// Pure functions — no DB, no req/res, no side effects.
// Same input always produces the same output, which is exactly what makes them easy to unit test.

function getTotalPower(characters) {
    if (!Array.isArray(characters)) {
        throw new Error('characters must be an array');
    }
    return characters.reduce((sum, character) => sum + character.power, 0);
}

function getCharacterNames(characters) {
    if (!Array.isArray(characters)) {
        throw new Error('characters must be an array');
    }
    return characters.map((character) => character.name);
}

module.exports = { getTotalPower, getCharacterNames };
