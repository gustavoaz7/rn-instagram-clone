import fetch from 'jest-fetch-mock';
import { BASE_URL } from '../constants';
import { fetchStories } from './stories';
import { isFail, isSuccess } from '../utils/remote-data';

describe('services - stories', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('fetchStories', () => {
    it('makes request correctly', () => {
      fetchStories();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0]).toEqual([`${BASE_URL}/stories`]);
    });

    it('returns success remote with parsed data', async () => {
      const expected = 'hello world';
      fetch.mockResponseOnce(JSON.stringify(expected));
      const result = await fetchStories();

      expect(isSuccess(result)).toBe(true);
      expect(result.data).toEqual(expected);
    });

    it('returns failed remote with error', async () => {
      const error = new Error(`failed ${Math.random()}`);
      fetch.mockRejectOnce(error);
      const result = await fetchStories();

      expect(isFail(result)).toBe(true);
      expect(result.error).toBe(error);
    });
  });
});
