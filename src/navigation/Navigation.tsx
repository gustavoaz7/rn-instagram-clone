import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import { StatusBar } from 'react-native';
import { RootStackNavigator } from './RootStackNavigator';
import { navigationRef } from './navigation-ref';
import { useThemeVariantSelector } from '../redux/theme-variant';
import { THEME_VARIANTS } from '../styles/theme';
import { addAlphaToHEX } from '../utils/color';

export function Navigation(): JSX.Element {
  const theme = useTheme();
  const themeVariant = useThemeVariantSelector();
  const defaultNavTheme =
    themeVariant === THEME_VARIANTS.LIGHT ? DefaultTheme : DarkTheme;
  const navigationTheme = {
    ...defaultNavTheme,
    colors: {
      ...defaultNavTheme.colors,
      background: theme.color.background,
      card: theme.color.background,
      text: theme.color.foreground,
      border: addAlphaToHEX(theme.color.foreground, 0.2),
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <StatusBar
        backgroundColor={theme.color.background}
        barStyle={
          themeVariant === THEME_VARIANTS.LIGHT
            ? 'dark-content'
            : 'light-content'
        }
      />
      <RootStackNavigator />
    </NavigationContainer>
  );
}
