import React from 'react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { Providers } from '../Providers';
import {
  initialState,
  themeVariantActions,
  themeVariantReducer,
  useThemeVariantSelector,
} from './theme-variant';
import { THEME_VARIANTS } from '../styles/theme';

describe('redux - theme-variant', () => {
  describe('changeVariant', () => {
    it('changes the theme variant', async () => {
      const store = configureStore({ reducer: themeVariantReducer });

      expect(store.getState()).toEqual(initialState);

      store.dispatch(themeVariantActions.changeVariant(THEME_VARIANTS.DARK));

      expect(store.getState()).toEqual(THEME_VARIANTS.DARK);

      store.dispatch(themeVariantActions.changeVariant(THEME_VARIANTS.LIGHT));

      expect(store.getState()).toEqual(THEME_VARIANTS.LIGHT);
    });
  });

  it('useThemeVariantSelector returns correct state', () => {
    const store = configureStore({
      reducer: combineReducers({ themeVariant: themeVariantReducer }),
    });
    const { result } = renderHook(() => useThemeVariantSelector(), {
      wrapper: props => <Providers {...props} store={store} />,
    });

    expect(result.current).toBe(initialState);
  });
});
