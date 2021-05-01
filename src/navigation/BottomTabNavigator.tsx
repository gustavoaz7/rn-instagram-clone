import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { SvgProps } from 'react-native-svg';
import { DefaultTheme, useTheme } from 'styled-components/native';
import { SearchScreen } from '../screens/SearchScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NotImplemented } from '../screens/NotImplemented';
import Home from '../../assets/svg/home.svg';
import Search from '../../assets/svg/search.svg';
import Reels from '../../assets/svg/reels.svg';
import Shop from '../../assets/svg/shop.svg';
import User from '../../assets/svg/user.svg';
import { BOTTOM_TAB_SCREENS } from './screens';
import { HomeStackNavigator, THomeStackParams } from './HomeStackNavigator';

export type TBottomTabParams = Record<BOTTOM_TAB_SCREENS, undefined> & {
  [BOTTOM_TAB_SCREENS.HOME]: NavigatorScreenParams<THomeStackParams>;
};

const SCREEN_COMPONENT_MAP: Record<BOTTOM_TAB_SCREENS, FC<SvgProps>> = {
  [BOTTOM_TAB_SCREENS.HOME]: Home,
  [BOTTOM_TAB_SCREENS.SEARCH]: Search,
  [BOTTOM_TAB_SCREENS.REELS]: Reels,
  [BOTTOM_TAB_SCREENS.SHOP]: Shop,
  [BOTTOM_TAB_SCREENS.PROFILE]: User,
};

function createTabBarIcon(
  screen: BOTTOM_TAB_SCREENS,
  focused: boolean,
  { color }: DefaultTheme,
): JSX.Element {
  const Component = SCREEN_COMPONENT_MAP[screen];
  return <Component color={focused ? color.black : color.gray} />;
}

const Tab = createBottomTabNavigator<TBottomTabParams>();

export function BottomTabNavigator(): JSX.Element {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName={BOTTOM_TAB_SCREENS.HOME}
      tabBarOptions={{ showLabel: false }}
    >
      <Tab.Screen
        name={BOTTOM_TAB_SCREENS.HOME}
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused }) =>
            createTabBarIcon(BOTTOM_TAB_SCREENS.HOME, focused, theme),
        }}
      />
      <Tab.Screen
        name={BOTTOM_TAB_SCREENS.SEARCH}
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            createTabBarIcon(BOTTOM_TAB_SCREENS.SEARCH, focused, theme),
        }}
      />
      <Tab.Screen
        name={BOTTOM_TAB_SCREENS.REELS}
        component={NotImplemented}
        options={{
          tabBarIcon: ({ focused }) =>
            createTabBarIcon(BOTTOM_TAB_SCREENS.REELS, focused, theme),
        }}
      />
      <Tab.Screen
        name={BOTTOM_TAB_SCREENS.SHOP}
        component={NotImplemented}
        options={{
          tabBarIcon: ({ focused }) =>
            createTabBarIcon(BOTTOM_TAB_SCREENS.SHOP, focused, theme),
        }}
      />
      <Tab.Screen
        name={BOTTOM_TAB_SCREENS.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            createTabBarIcon(BOTTOM_TAB_SCREENS.PROFILE, focused, theme),
        }}
      />
    </Tab.Navigator>
  );
}
