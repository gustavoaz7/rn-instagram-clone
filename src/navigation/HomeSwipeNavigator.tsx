import React, { useCallback, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
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

const SCREENS_ALLOWED_TO_SWIPE = [
  ...Object.values(HOME_SWIPE_SCREENS),
  BOTTOM_TAB_SCREENS.HOME,
  HOME_STACK_SCREENS.FEED,
  DIRECT_STACK_SCREENS.DIRECT,
] as string[];

export type THomeSwitchParams = {
  [HOME_SWIPE_SCREENS.CAMERA]: undefined;
  [HOME_SWIPE_SCREENS.BOTTOM_TAB]: NavigatorScreenParams<TBottomTabParams>;
  [HOME_SWIPE_SCREENS.DIRECT]: NavigatorScreenParams<TDirectStackParams>;
};

const Tab = createMaterialTopTabNavigator<THomeSwitchParams>();

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
