import fetch from 'jest-fetch-mock';
import { BASE_URL } from '../constants';
import { fetchStories } from './stories';

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

    it('returns response json', async () => {
      const expected = 'hello world';
      fetch.mockResponseOnce(JSON.stringify(expected));

      expect(await fetchStories()).toEqual(expected);
    });

    it('does not handle error', () => {
      fetch.mockRejectOnce(new Error(''));

      expect(fetchStories()).rejects.toThrow();
    });
  });
});
