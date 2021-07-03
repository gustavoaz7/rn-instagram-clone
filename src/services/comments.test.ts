import fetch from 'jest-fetch-mock';
import { BASE_URL } from '../constants';
import { isFail, isSuccess } from '../utils/remote-data';
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

    it('returns success remote with parsed data', async () => {
      const expected = 'hello world';
      fetch.mockResponseOnce(JSON.stringify(expected));
      const result = await fetchComments(postId, params);

      expect(isSuccess(result)).toBe(true);
      expect(result.data).toEqual(expected);
    });

    it('returns failed remote with error', async () => {
      const error = new Error('failed');
      fetch.mockRejectOnce(error);
      const result = await fetchComments(postId, params);

      expect(isFail(result)).toBe(true);
      expect(result.error).toBe(error);
    });
  });
});
