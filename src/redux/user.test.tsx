import React from 'react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { renderHook, act } from '@testing-library/react-hooks';
import { fakeLogin } from '../api';
import { Providers } from '../Providers';
import { initialState, userActions, userReducer, userSelectors } from './user';

jest.mock('../api');
const fakeLoginMock = fakeLogin as jest.Mock;

describe('redux - user', () => {
  describe('login', () => {
    beforeEach(() => {
      fakeLoginMock.mockClear();
    });

    it('handles success case correctly', async () => {
      const store = configureStore({ reducer: userReducer });
      const user = { name: 'me' };
      fakeLoginMock.mockResolvedValueOnce(user);

      expect(store.getState()).toEqual(initialState);

      const action = store.dispatch(userActions.login());

      expect(fakeLoginMock).toHaveBeenCalledTimes(1);
      expect(store.getState()).toEqual({
        ...initialState,
        loading: true,
      });

      await action;

      expect(store.getState()).toEqual({
        loading: false,
        error: null,
        value: user,
      });
    });

    it('handles reject case correctly', async () => {
      const store = configureStore({ reducer: userReducer });
      const error = new Error('login failed');
      fakeLoginMock.mockRejectedValueOnce(error);

      expect(store.getState()).toEqual(initialState);

      const action = store.dispatch(userActions.login());

      expect(fakeLoginMock).toHaveBeenCalledTimes(1);
      expect(store.getState()).toEqual({
        ...initialState,
        loading: true,
      });

      await action;

      expect(store.getState()).toEqual({
        loading: false,
        error: error.message,
        value: null,
      });
    });
  });

  describe('selectors', () => {
    it('useLoadingSelector', () => {
      const store = configureStore({
        reducer: combineReducers({ user: userReducer }),
      });
      const { result } = renderHook(() => userSelectors.useLoadingSelector(), {
        wrapper: props => <Providers {...props} store={store} />,
      });

      expect(result.current).toBe(initialState.loading);
    });

    // `user` and `error` are both initially null. Hence an action to asert
    // for different values.
    // This breaks the idea of *unit testing* but otherwise we could end up
    // with false-positives.
    it('useUserSelector', async () => {
      const store = configureStore({
        reducer: combineReducers({ user: userReducer }),
      });
      const user = 'yo';
      fakeLoginMock.mockResolvedValueOnce(user);
      const { result } = renderHook(() => userSelectors.useUserSelector(), {
        wrapper: props => <Providers {...props} store={store} />,
      });

      await act(async () => {
        await store.dispatch(userActions.login());
      });

      expect(result.current).toBe(user);
    });

    it('useErrorSelector', async () => {
      const store = configureStore({
        reducer: combineReducers({ user: userReducer }),
      });
      const error = new Error('noo');
      fakeLoginMock.mockRejectedValueOnce(error);
      const { result } = renderHook(() => userSelectors.useErrorSelector(), {
        wrapper: props => <Providers {...props} store={store} />,
      });

      await act(async () => {
        await store.dispatch(userActions.login());
      });

      expect(result.current).toBe(error.message);
    });
  });
});
