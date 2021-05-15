import React from 'react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { fetchPosts } from '../api';
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
    beforeEach(() => {
      fetchPostsMock.mockClear();
    });

    it('handles success case correctly', async () => {
      const store = configureStore({ reducer: postsReducer });
      const posts = [{ fake: 'post' }];
      fetchPostsMock.mockResolvedValueOnce(posts);

      expect(store.getState()).toEqual(initialState);

      const action = store.dispatch(postsActions.getPosts());

      expect(fetchPostsMock).toHaveBeenCalledTimes(1);
      expect(store.getState()).toEqual({
        ...initialState,
        loading: true,
      });

      await action;

      expect(store.getState()).toEqual({
        loading: false,
        error: null,
        posts,
      });
    });

    it('handles reject case correctly', async () => {
      const store = configureStore({ reducer: postsReducer });
      const error = new Error('failed fetching posts');
      fetchPostsMock.mockRejectedValueOnce(error);

      expect(store.getState()).toEqual(initialState);

      const action = store.dispatch(postsActions.getPosts());

      expect(fetchPostsMock).toHaveBeenCalledTimes(1);
      expect(store.getState()).toEqual({
        ...initialState,
        loading: true,
      });

      await action;

      expect(store.getState()).toEqual({
        loading: false,
        error: error.message,
        posts: [],
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
