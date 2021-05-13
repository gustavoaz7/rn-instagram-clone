import { dateToString } from './date';

describe('utils - date', () => {
  describe('dateToString', () => {
    it('returns correct string', () => {
      expect(dateToString(new Date(Date.now() - 50 * 1000))).toBe('Just now');
      expect(dateToString(new Date(Date.now() - 100 * 1000))).toBe(
        '1 minute ago',
      );
      expect(dateToString(new Date(Date.now() - 150 * 1000))).toBe(
        '2 minutes ago',
      );
      expect(dateToString(new Date(Date.now() - 3550 * 1000))).toBe(
        '59 minutes ago',
      );
      expect(dateToString(new Date(Date.now() - 3650 * 1000))).toBe(
        '1 hour ago',
      );
      expect(dateToString(new Date(Date.now() - 86350 * 1000))).toBe(
        '23 hours ago',
      );
      expect(dateToString(new Date(Date.now() - 86450 * 1000))).toBe(
        '1 day ago',
      );
      expect(dateToString(new Date(Date.now() - 86400 * 29 * 1000))).toBe(
        '29 days ago',
      );
      const pastDate = new Date(Date.now() - 86400 * 31 * 1000);
      expect(dateToString(pastDate)).toBe(pastDate.toDateString());
    });
  });
});
