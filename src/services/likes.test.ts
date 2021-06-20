import fetch from 'jest-fetch-mock';
import { BASE_URL } from '../constants';
import { postLike, TSaveLikeBody } from './likes';

describe('services - likes', () => {
  const params: TSaveLikeBody = {
    collection: 'posts',
    id: `${Math.random()}`,
    flag: true,
  };

  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('postLike', () => {
    it('makes request correctly', () => {
      postLike(params);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0]).toEqual([
        `${BASE_URL}/likes`,
        {
          method: 'post',
          body: JSON.stringify(params),
          headers: { 'Content-Type': 'application/json' },
        },
      ]);
    });

    it('returns nothing', async () => {
      const expected = 'hello world';
      fetch.mockResponseOnce(JSON.stringify(expected));

      expect(await postLike(params)).toBeUndefined();
    });

    it('does not handle error', () => {
      fetch.mockRejectOnce(new Error(''));

      expect(postLike(params)).rejects.toThrow();
    });
  });
});
