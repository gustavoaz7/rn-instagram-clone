import React from 'react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { fetchPosts, TFetchPostsParams } from '../api';
import { Providers } from '../Providers';
import {
  initialState,
  postsActions,
  postsReducer,
  usePostsSelector,
} from './posts';

jest.mock('../api');
const fetchPostsMock = fetchPosts as jest.Mock;

describe('redux - posts', () => {
  describe('getPosts', () => {
    const params: TFetchPostsParams = {
      offset: 0,
      limit: 10,
    };

    beforeEach(() => {
      fetchPostsMock.mockClear();
    });

    describe('when request succeeds', () => {
      const store = configureStore({ reducer: postsReducer });
      const response1 = {
        posts: [{ fake1: 'post1' }],
        canFetchMorePosts: false,
      };

      it('adds response posts to state', async () => {
        fetchPostsMock.mockResolvedValueOnce(response1);

        expect(store.getState()).toEqual(initialState);

        const action = store.dispatch(postsActions.getPosts(params));

        expect(fetchPostsMock).toHaveBeenCalledTimes(1);
        expect(store.getState()).toEqual({
          ...initialState,
          loading: true,
        });

        await action;

        expect(store.getState()).toEqual({
          loading: false,
          error: null,
          posts: response1.posts,
          canFetchMorePosts: response1.canFetchMorePosts,
        });
      });

      it('appends new posts to end of state list', async () => {
        const response2 = {
          posts: [{ fake2: 'post2' }],
          canFetchMorePosts: false,
        };
        fetchPostsMock.mockResolvedValueOnce(response2);

        await store.dispatch(postsActions.getPosts(params));

        expect(store.getState()).toEqual({
          loading: false,
          error: null,
          posts: [...response1.posts, ...response2.posts],
          canFetchMorePosts: response2.canFetchMorePosts,
        });
      });
    });

    it('handles reject case correctly', async () => {
      const store = configureStore({ reducer: postsReducer });
      const error = new Error('failed fetching posts');
      fetchPostsMock.mockRejectedValueOnce(error);

      expect(store.getState()).toEqual(initialState);

      const action = store.dispatch(postsActions.getPosts(params));

      expect(fetchPostsMock).toHaveBeenCalledTimes(1);
      expect(store.getState()).toEqual({
        ...initialState,
        loading: true,
      });

      await action;

      expect(store.getState()).toEqual({
        ...initialState,
        loading: false,
        error: error.message,
      });
    });
  });

  it('usePostsSelector returns correct state', () => {
    const store = configureStore({
      reducer: combineReducers({ posts: postsReducer }),
    });
    const { result } = renderHook(() => usePostsSelector(), {
      wrapper: props => <Providers {...props} store={store} />,
    });

    expect(result.current).toBe(initialState);
  });
});
