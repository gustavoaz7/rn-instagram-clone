import React, { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RootSiblingParent } from 'react-native-root-siblings'; // dep of rn-root-toast
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
    <RootSiblingParent>
      <Provider store={store}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </Provider>
    </RootSiblingParent>
  );
}
