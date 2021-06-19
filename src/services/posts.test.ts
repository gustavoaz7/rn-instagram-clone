import fetch from 'jest-fetch-mock';
import { BASE_URL } from '../constants';
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

    it('returns response json', async () => {
      const expected = 'hello world';
      fetch.mockResponseOnce(JSON.stringify(expected));

      expect(await fetchPosts(params)).toEqual(expected);
    });

    it('does not handle error', () => {
      fetch.mockRejectOnce(new Error(''));

      expect(fetchPosts(params)).rejects.toThrow();
    });
  });
});
