import React from 'react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { fakeLogin } from '../services/user';
import { Providers } from '../Providers';
import {
  initialState,
  userActions,
  userReducer,
  useUserSelector,
} from './user';
import { makeFail, makeSuccess } from '../utils/remote-data';
import { themeVariantReducer } from './theme-variant';

jest.mock('../services/user');
const fakeLoginMock = fakeLogin as jest.Mock;

describe('redux - user', () => {
  describe('login', () => {
    it('handles success case correctly', async () => {
      const store = configureStore({ reducer: userReducer });
      const user = { name: 'me' };
      fakeLoginMock.mockResolvedValueOnce(makeSuccess(user));

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
        user,
      });
    });

    it('handles reject case correctly', async () => {
      const store = configureStore({ reducer: userReducer });
      const error = new Error('login failed');
      fakeLoginMock.mockResolvedValueOnce(makeFail(error));

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
        user: null,
      });
    });
  });

  it('useUserSelector returns correct state', () => {
    const store = configureStore({
      reducer: combineReducers({
        user: userReducer,
        themeVariant: themeVariantReducer,
      }),
    });
    const { result } = renderHook(() => useUserSelector(), {
      wrapper: props => <Providers {...props} store={store} />,
    });

    expect(result.current).toBe(initialState);
  });
});
