import fetch from 'jest-fetch-mock';
import { BASE_URL } from '../constants';
import { fetchComments, TFetchCommentsParams } from './comments';

describe('services - comments', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('fetchComments', () => {
    const postId = `${Math.random()}`;
    const params: TFetchCommentsParams = {
      offset: Math.random(),
      limit: Math.random(),
    };

    it('makes request correctly', () => {
      fetchComments(postId, params);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0]).toEqual([
        `${BASE_URL}/comments/${postId}?offset=${params.offset}&limit=${params.limit}`,
      ]);
    });

    describe('when refresh is provided', () => {
      it('adds `refresh` param ', () => {
        fetchComments(postId, { ...params, refresh: true });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch.mock.calls[0]).toEqual([
          `${BASE_URL}/comments/${postId}?offset=${params.offset}&limit=${params.limit}&refresh=true`,
        ]);
      });
    });

    it('returns response json', async () => {
      const expected = 'hello world';
      fetch.mockResponseOnce(JSON.stringify(expected));

      expect(await fetchComments(postId, params)).toEqual(expected);
    });

    it('does not handle error', () => {
      fetch.mockRejectOnce(new Error(''));

      expect(fetchComments(postId, params)).rejects.toThrow();
    });
  });
});
