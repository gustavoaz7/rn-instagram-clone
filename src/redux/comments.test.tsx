import React from 'react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { fetchComments } from '../api';
import { Providers } from '../Providers';
import {
  initialState,
  commentsActions,
  commentsReducer,
  useCommentsSelector,
  TGetCommentsThunkArg,
} from './comments';

jest.mock('../api');
const fetchCommentsMock = fetchComments as jest.Mock;

describe('redux - comments', () => {
  describe('getComments', () => {
    const thunkArg: TGetCommentsThunkArg = {
      postId: `${Math.random()}`,
      offset: Math.random(),
      limit: Math.random(),
    };

    beforeEach(() => {
      fetchCommentsMock.mockClear();
    });

    it('calls fetchComments with provided params', () => {
      const { postId, ...params } = thunkArg;
      const store = configureStore({ reducer: commentsReducer });
      store.dispatch(commentsActions.getComments(thunkArg));

      expect(fetchCommentsMock).toHaveBeenCalledWith(postId, params);
    });

    describe('when request succeeds', () => {
      const store = configureStore({ reducer: commentsReducer });
      const response1 = {
        comments: [{ fake1: 'comment1' }],
        canFetchMoreComments: false,
      };

      it('adds response comments to state', async () => {
        fetchCommentsMock.mockResolvedValueOnce(response1);

        expect(store.getState()).toEqual(initialState);

        const action = store.dispatch(commentsActions.getComments(thunkArg));

        expect(fetchCommentsMock).toHaveBeenCalledTimes(1);
        expect(store.getState()).toEqual({
          ...initialState,
          loading: true,
        });

        await action;

        expect(store.getState()).toEqual({
          loading: false,
          error: null,
          comments: response1.comments,
          canFetchMoreComments: response1.canFetchMoreComments,
        });
      });

      it('appends new comments to end of state list', async () => {
        const response2 = {
          comments: [{ fake2: 'comment2' }],
          canFetchMoreComments: false,
        };
        fetchCommentsMock.mockResolvedValueOnce(response2);

        await store.dispatch(commentsActions.getComments(thunkArg));

        expect(store.getState()).toEqual({
          loading: false,
          error: null,
          comments: [...response1.comments, ...response2.comments],
          canFetchMoreComments: response2.canFetchMoreComments,
        });
      });

      describe('when `refresh` param is provided', () => {
        it('replaces current comments with response', async () => {
          const response3 = {
            comments: [{ fake3: 'comment3' }],
            canFetchMoreComments: false,
          };
          fetchCommentsMock.mockResolvedValueOnce(response3);

          expect(store.getState().comments).not.toEqual(response3.comments);

          await store.dispatch(
            commentsActions.getComments({ ...thunkArg, refresh: true }),
          );

          expect(store.getState()).toEqual({
            loading: false,
            error: null,
            comments: response3.comments,
            canFetchMoreComments: response3.canFetchMoreComments,
          });
        });
      });
    });

    it('handles reject case correctly', async () => {
      const store = configureStore({ reducer: commentsReducer });
      const error = new Error('failed fetching comments');
      fetchCommentsMock.mockRejectedValueOnce(error);

      expect(store.getState()).toEqual(initialState);

      const action = store.dispatch(commentsActions.getComments(thunkArg));

      expect(fetchCommentsMock).toHaveBeenCalledTimes(1);
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

  describe('clearComments', () => {
    it('restores store to initial state', async () => {
      const store = configureStore({ reducer: commentsReducer });
      // First we have to change the current store state
      const error = new Error('failed fetching comments');
      fetchCommentsMock.mockRejectedValueOnce(error);
      await store.dispatch(
        commentsActions.getComments({
          postId: '1',
          offset: 0,
          limit: 10,
        }),
      );
      expect(store.getState()).toEqual({
        ...initialState,
        loading: false,
        error: error.message,
      });

      // Now we can assert it returns to initial state
      store.dispatch(commentsActions.clearComments());

      expect(store.getState()).toEqual(initialState);
    });
  });

  it('useCommentsSelector returns correct state', () => {
    const store = configureStore({
      reducer: combineReducers({ comments: commentsReducer }),
    });
    const { result } = renderHook(() => useCommentsSelector(), {
      wrapper: props => <Providers {...props} store={store} />,
    });

    expect(result.current).toBe(initialState);
  });
});
