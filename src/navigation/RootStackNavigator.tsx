import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { HomeSwipeNavigator } from './HomeSwipeNavigator';
import { ROOT_STACK_SCREENS } from './screens';

export type TRootStackParams = {
  [ROOT_STACK_SCREENS.HOME_SWIPE]: undefined;
};

export type THomeStackProps = StackNavigationProp<TRootStackParams>;

const Stack = createStackNavigator<TRootStackParams>();

export function RootStackNavigator(): JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ROOT_STACK_SCREENS.HOME_SWIPE}
        component={HomeSwipeNavigator}
      />
    </Stack.Navigator>
  );
}
