import React from 'react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { fetchPosts } from '../api';
import { Providers } from '../Providers';
import {
  initialState,
  postsActions,
  postsReducer,
  postsSelectors,
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
        value: posts,
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
        value: [],
      });
    });
  });

  describe('selectors', () => {
    it('useLoadingSelector', () => {
      const store = configureStore({
        reducer: combineReducers({ posts: postsReducer }),
      });
      const { result } = renderHook(() => postsSelectors.useLoadingSelector(), {
        wrapper: props => <Providers {...props} store={store} />,
      });

      expect(result.current).toBe(initialState.loading);
    });

    it('usePostsSelector', async () => {
      const store = configureStore({
        reducer: combineReducers({ posts: postsReducer }),
      });
      const { result } = renderHook(() => postsSelectors.usePostsSelector(), {
        wrapper: props => <Providers {...props} store={store} />,
      });

      expect(result.current).toBe(initialState.value);
    });

    it('useErrorSelector', async () => {
      const store = configureStore({
        reducer: combineReducers({ posts: postsReducer }),
      });
      const { result } = renderHook(() => postsSelectors.useErrorSelector(), {
        wrapper: props => <Providers {...props} store={store} />,
      });

      expect(result.current).toBe(initialState.error);
    });
  });
});
