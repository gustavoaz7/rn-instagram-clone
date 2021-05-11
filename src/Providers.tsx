import React, { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { Provider } from 'react-redux';
import { theme as stylesTheme } from './styles/theme';
import { store as reduxStore } from './redux/store';

type TProvidersProps = {
  children: ReactNode;
  store?: typeof reduxStore;
  theme?: typeof stylesTheme;
};

export function Providers({
  children,
  store = reduxStore,
  theme = stylesTheme,
}: TProvidersProps): JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Provider>
  );
}
