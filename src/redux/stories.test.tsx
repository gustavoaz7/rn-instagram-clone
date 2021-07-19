import React from 'react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { fetchStories } from '../services/stories';
import { Providers } from '../Providers';
import {
  initialState,
  storiesActions,
  storiesReducer,
  useStoriesSelector,
} from './stories';
import { makeFail, makeSuccess } from '../utils/remote-data';

jest.mock('../services/stories');
const fetchStoriesMock = fetchStories as jest.Mock;

describe('redux - stories', () => {
  describe('getStories', () => {
    beforeEach(() => {
      fetchStoriesMock.mockClear();
    });

    describe('when request succeeds', () => {
      const store = configureStore({ reducer: storiesReducer });
      const response = [{ fake1: 'story1' }];

      it('adds response stories to state', async () => {
        fetchStoriesMock.mockResolvedValueOnce(makeSuccess(response));

        expect(store.getState()).toEqual(initialState);

        const action = store.dispatch(storiesActions.getStories());

        expect(fetchStoriesMock).toHaveBeenCalledTimes(1);
        expect(store.getState()).toEqual({
          ...initialState,
          loading: true,
        });

        await action;

        expect(store.getState()).toEqual({
          loading: false,
          error: null,
          stories: response,
        });
      });
    });

    it('handles reject case correctly', async () => {
      const store = configureStore({ reducer: storiesReducer });
      const error = new Error('failed fetching stories');
      fetchStoriesMock.mockResolvedValueOnce(makeFail(error));

      expect(store.getState()).toEqual(initialState);

      const action = store.dispatch(storiesActions.getStories());

      expect(fetchStoriesMock).toHaveBeenCalledTimes(1);
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

  it('useStoriesSelector returns correct state', () => {
    const store = configureStore({
      reducer: combineReducers({ stories: storiesReducer }),
    });
    const { result } = renderHook(() => useStoriesSelector(), {
      wrapper: props => <Providers {...props} store={store} />,
    });

    expect(result.current).toBe(initialState);
  });
});
