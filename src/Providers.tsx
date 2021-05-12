import React, { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { theme as stylesTheme } from './styles/theme';
import { store as reduxStore } from './redux/store';

type TProvidersProps = {
  children?: ReactNode;
  store?: ReturnType<typeof configureStore>;
  theme?: typeof stylesTheme;
};

export function Providers({
  children = null,
  store = reduxStore,
  theme = stylesTheme,
}: TProvidersProps): JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Provider>
  );
}
