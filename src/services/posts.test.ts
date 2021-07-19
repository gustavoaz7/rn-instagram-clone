import fetch from 'jest-fetch-mock';
import { BASE_URL } from '../constants';
import { isFail, isSuccess } from '../utils/remote-data';
import { fetchPosts, TFetchPostsParams } from './posts';

describe('services - posts', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('fetchPosts', () => {
    const params: TFetchPostsParams = {
      offset: Math.random(),
      limit: Math.random(),
    };

    it('makes request correctly', () => {
      fetchPosts(params);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0]).toEqual([
        `${BASE_URL}/posts?offset=${params.offset}&limit=${params.limit}`,
      ]);
    });

    describe('when refresh is provided', () => {
      it('adds `refresh` param ', () => {
        fetchPosts({ ...params, refresh: true });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch.mock.calls[0]).toEqual([
          `${BASE_URL}/posts?offset=${params.offset}&limit=${params.limit}&refresh=true`,
        ]);
      });
    });

    it('returns success remote with parsed data', async () => {
      const expected = 'hello world';
      fetch.mockResponseOnce(JSON.stringify(expected));
      const result = await fetchPosts(params);

      expect(isSuccess(result)).toBe(true);
      expect(result.data).toEqual(expected);
    });

    it('returns failed remote with error', async () => {
      const error = new Error(`failed ${Math.random()}`);
      fetch.mockRejectOnce(error);
      const result = await fetchPosts(params);

      expect(isFail(result)).toBe(true);
      expect(result.error).toBe(error);
    });
  });
});
