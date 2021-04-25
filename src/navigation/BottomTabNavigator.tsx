import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NotImplemented } from '../screens/NotImplemented';

export enum BOTTOM_TAB_SCREENS {
  HOME = 'Home',
  SEARCH = 'Search',
  REELS = 'Reels',
  SHOP = 'Shop',
  PROFILE = 'Profile',
}
const Tab = createBottomTabNavigator();

export function BottomTabNavigator(): JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name={BOTTOM_TAB_SCREENS.HOME} component={HomeScreen} />
        <Tab.Screen name={BOTTOM_TAB_SCREENS.SEARCH} component={SearchScreen} />
        <Tab.Screen
          name={BOTTOM_TAB_SCREENS.REELS}
          component={NotImplemented}
        />
        <Tab.Screen name={BOTTOM_TAB_SCREENS.SHOP} component={NotImplemented} />
        <Tab.Screen
          name={BOTTOM_TAB_SCREENS.PROFILE}
          component={ProfileScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
