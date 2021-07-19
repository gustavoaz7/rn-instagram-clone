import fetch from 'jest-fetch-mock';
import { BASE_URL, STATIC_USER_DATA } from '../constants';
import { isFail, isSuccess } from '../utils/remote-data';
import { fakeLogin } from './user';

describe('services - user', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('fakeLogin', () => {
    it('makes request correctly', () => {
      fakeLogin();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0]).toEqual([
        `${BASE_URL}/user/login`,
        {
          method: 'post',
          body: JSON.stringify(STATIC_USER_DATA),
          headers: { 'Content-Type': 'application/json' },
        },
      ]);
    });

    it('returns success remote with parsed data', async () => {
      const expected = 'hello world';
      fetch.mockResponseOnce(JSON.stringify(expected));
      const result = await fakeLogin();

      expect(isSuccess(result)).toBe(true);
      expect(result.data).toEqual(expected);
    });

    it('returns failed remote with error', async () => {
      const error = new Error(`failed ${Math.random()}`);
      fetch.mockRejectOnce(error);
      const result = await fakeLogin();

      expect(isFail(result)).toBe(true);
      expect(result.error).toBe(error);
    });
  });
});
