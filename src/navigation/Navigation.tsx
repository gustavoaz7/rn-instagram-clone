import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { HomeSwitchNavigator } from './HomeSwitchNavigator';

export function Navigation(): JSX.Element {
  return (
    <NavigationContainer>
      <HomeSwitchNavigator />
    </NavigationContainer>
  );
}
