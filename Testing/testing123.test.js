const { getTotalPower, getCharacterNames } = require('./testing123.js');

describe('getTotalPower', () => {
    test('adds up the power of all characters', () => {
        const list = [{ name: 'Aria', power: 20 }, { name: 'Bolt', power: 10 }];
        expect(getTotalPower(list)).toBe(30);
    });

    test('throws when input is not an array', () => {
        expect(() => getTotalPower('not an array')).toThrow();
    });
});

describe('getCharacterNames', () => {
    const list = [{ name: 'Aria', power: 20 }, { name: 'Bolt', power: 10 }];

    test('returns an array matching the character names', () => {
        expect(getCharacterNames(list)).toEqual(['Aria','Bolt']);
    });

    test('contains a specific name', () => {
        expect(getCharacterNames(list)).toContain('Aria',);
    });

    test('has the same length as the input list', () => {
        expect(getCharacterNames(list)).toHaveLength(2);
    });

    test('throws when input is not an array', () => {
        expect(() => getCharacterNames(null)).toThrow();
    });
});
