import fetch from 'jest-fetch-mock';
import { BASE_URL } from '../constants';
import { isFail, isSuccess } from '../utils/remote-data';
import { postLike, TPostLikeBody } from './likes';

describe('services - likes', () => {
  const params: TPostLikeBody = {
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

    it('returns empty success result', async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      const result = await postLike(params);

      expect(isSuccess(result)).toBe(true);
      expect(result.data).toBeUndefined();
    });

    it('returns failed result with error', async () => {
      const error = new Error('failed');
      fetch.mockRejectOnce(error);
      const result = await postLike(params);

      expect(isFail(result)).toBe(true);
      expect(result.error).toBe(error);
    });
  });
});
