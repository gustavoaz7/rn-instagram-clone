import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import { RootStackNavigator } from './RootStackNavigator';
import { navigationRef } from './navigation-ref';

export function Navigation(): JSX.Element {
  const theme = useTheme();
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.color.white,
    },
  };
  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <RootStackNavigator />
    </NavigationContainer>
  );
}
