import fetch from 'jest-fetch-mock';
import { BASE_URL, STATIC_USER_DATA } from '../constants';
import { fakeLogin } from './api';

describe('api', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('fakeLogin', () => {
    it('makes request correctly', () => {
      fakeLogin();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0]).toEqual([
        `${BASE_URL}/configure`,
        {
          method: 'post',
          body: JSON.stringify(STATIC_USER_DATA),
          headers: { 'Content-Type': 'application/json' },
        },
      ]);
    });

    it('returns response json', async () => {
      const expected = 'hello world';
      fetch.mockResponseOnce(JSON.stringify(expected));

      expect(await fakeLogin()).toEqual(expected);
    });

    it('does not handle error', () => {
      fetch.mockRejectOnce(new Error(''));

      expect(fakeLogin()).rejects.toThrow();
    });
  });
});
