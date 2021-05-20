import { pluralizeWithS } from './string';

describe('utils - string', () => {
  describe('pluralizeWithS', () => {
    it('returns correct string', () => {
      const word = 'like';
      expect(pluralizeWithS(word, -1)).toBe(word);
      expect(pluralizeWithS(word, 0)).toBe(word);
      expect(pluralizeWithS(word, 1)).toBe(word);
      expect(pluralizeWithS(word, 2)).toBe(`${word}s`);
      expect(pluralizeWithS(word, 20)).toBe(`${word}s`);
      expect(pluralizeWithS(word, 200)).toBe(`${word}s`);
    });
  });
});
