import React, { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { Provider, ProviderProps } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RootSiblingParent } from 'react-native-root-siblings'; // dep of rn-root-toast
import { theme as stylesTheme } from './styles/theme';
import { store as reduxStore } from './redux/store';
import { useThemeVariantSelector } from './redux/theme-variant';

type TProvidersProps = {
  children?: ReactNode;
  store?: ProviderProps['store'];
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
        <Theming theme={theme}>{children}</Theming>
      </Provider>
    </RootSiblingParent>
  );
}

function Theming({
  theme,
  children,
}: Required<Omit<TProvidersProps, 'store'>>): JSX.Element {
  const themeVariant = useThemeVariantSelector();
  return <ThemeProvider theme={theme[themeVariant]}>{children}</ThemeProvider>;
}
