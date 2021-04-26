import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NotImplemented } from '../screens/NotImplemented';
import Home from '../../assets/svg/home.svg';
import Search from '../../assets/svg/search.svg';
import Reels from '../../assets/svg/reels.svg';
import Shop from '../../assets/svg/shop.svg';
import User from '../../assets/svg/user.svg';

export enum BOTTOM_TAB_SCREENS {
  HOME = '@Bottom/Home',
  SEARCH = '@Bottom/Search',
  REELS = '@Bottom/Reels',
  SHOP = '@Bottom/Shop',
  PROFILE = '@Bottom/Profile',
}

const SCREEN_COMPONENT_MAP = {
  [BOTTOM_TAB_SCREENS.HOME]: Home,
  [BOTTOM_TAB_SCREENS.SEARCH]: Search,
  [BOTTOM_TAB_SCREENS.REELS]: Reels,
  [BOTTOM_TAB_SCREENS.SHOP]: Shop,
  [BOTTOM_TAB_SCREENS.PROFILE]: User,
};

function createTabBarIcon(
  screen: BOTTOM_TAB_SCREENS,
  focused: boolean,
): JSX.Element {
  const Component = SCREEN_COMPONENT_MAP[screen];
  return (
    <Component width={24} height={24} color={focused ? 'black' : 'gray'} />
  );
}

const Tab = createBottomTabNavigator();

export function BottomTabNavigator(): JSX.Element {
  return (
    <Tab.Navigator
      initialRouteName={BOTTOM_TAB_SCREENS.HOME}
      tabBarOptions={{ showLabel: false }}
    >
      <Tab.Screen
        name={BOTTOM_TAB_SCREENS.HOME}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            createTabBarIcon(BOTTOM_TAB_SCREENS.HOME, focused),
        }}
      />
      <Tab.Screen
        name={BOTTOM_TAB_SCREENS.SEARCH}
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            createTabBarIcon(BOTTOM_TAB_SCREENS.SEARCH, focused),
        }}
      />
      <Tab.Screen
        name={BOTTOM_TAB_SCREENS.REELS}
        component={NotImplemented}
        options={{
          tabBarIcon: ({ focused }) =>
            createTabBarIcon(BOTTOM_TAB_SCREENS.REELS, focused),
        }}
      />
      <Tab.Screen
        name={BOTTOM_TAB_SCREENS.SHOP}
        component={NotImplemented}
        options={{
          tabBarIcon: ({ focused }) =>
            createTabBarIcon(BOTTOM_TAB_SCREENS.SHOP, focused),
        }}
      />
      <Tab.Screen
        name={BOTTOM_TAB_SCREENS.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            createTabBarIcon(BOTTOM_TAB_SCREENS.PROFILE, focused),
        }}
      />
    </Tab.Navigator>
  );
}
