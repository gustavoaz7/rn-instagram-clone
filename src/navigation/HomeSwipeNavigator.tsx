import React, { useCallback, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  DirectStackNavigator,
  TDirectStackParams,
} from './DirectStackNavigator';
import { NotImplemented } from '../screens/NotImplemented';
import {
  HOME_SWIPE_SCREENS,
  BOTTOM_TAB_SCREENS,
  HOME_STACK_SCREENS,
  DIRECT_STACK_SCREENS,
} from './screens';
import { BottomTabNavigator, TBottomTabParams } from './BottomTabNavigator';
import { navigationRef } from './navigation-ref';
import type { TRootStackParams } from './RootStackNavigator';

const SCREENS_ALLOWED_TO_SWIPE = [
  ...Object.values(HOME_SWIPE_SCREENS),
  BOTTOM_TAB_SCREENS.HOME,
  HOME_STACK_SCREENS.FEED,
  DIRECT_STACK_SCREENS.DIRECT,
] as string[];

export type THomeSwipeParams = {
  [HOME_SWIPE_SCREENS.CAMERA]: undefined;
  [HOME_SWIPE_SCREENS.BOTTOM_TAB]: NavigatorScreenParams<TBottomTabParams>;
  [HOME_SWIPE_SCREENS.DIRECT]: NavigatorScreenParams<TDirectStackParams>;
};

export type THomeSwipeNavigationProps = CompositeNavigationProp<
  StackNavigationProp<THomeSwipeParams>,
  StackNavigationProp<TRootStackParams>
>;

const Tab = createMaterialTopTabNavigator<THomeSwipeParams>();

export function HomeSwipeNavigator(): JSX.Element {
  const [swipeEnabled, setSwipeEnabled] = useState(true);

  const handleStateChange = useCallback(() => {
    const route = navigationRef.current?.getCurrentRoute();

    if (route) {
      const isRouteAllowedToSwipe = SCREENS_ALLOWED_TO_SWIPE.includes(
        route.name,
      );
      if (isRouteAllowedToSwipe && !swipeEnabled) {
        setSwipeEnabled(true);
      } else if (!isRouteAllowedToSwipe && swipeEnabled) {
        setSwipeEnabled(false);
      }
    }
  }, [swipeEnabled]);

  return (
    <Tab.Navigator
      initialRouteName={HOME_SWIPE_SCREENS.BOTTOM_TAB}
      tabBarOptions={{ tabStyle: { display: 'none' } }}
      swipeEnabled={swipeEnabled}
    >
      <Tab.Screen name={HOME_SWIPE_SCREENS.CAMERA} component={NotImplemented} />
      <Tab.Screen
        name={HOME_SWIPE_SCREENS.BOTTOM_TAB}
        component={BottomTabNavigator}
        listeners={{ state: handleStateChange }}
      />
      <Tab.Screen
        name={HOME_SWIPE_SCREENS.DIRECT}
        component={DirectStackNavigator}
        listeners={{ state: handleStateChange }}
      />
    </Tab.Navigator>
  );
}
