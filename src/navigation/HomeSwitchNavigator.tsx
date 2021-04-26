import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { DirectScreen } from '../screens/DirectScreen';
import { HomeStackNavigator } from './HomeStackNavigator';
import { NotImplemented } from '../screens/NotImplemented';

export enum SWITCH_SCREENS {
  CAMERA = '@Switch/Camera',
  HOME = '@Switch/Home',
  DIRECT = '@Switch/Direct',
}

function nullFn() {
  return null;
}

const Tab = createMaterialTopTabNavigator();

export function HomeSwitchNavigator(): JSX.Element {
  return (
    <Tab.Navigator
      initialRouteName={SWITCH_SCREENS.HOME}
      backBehavior="initialRoute"
      tabBar={nullFn}
    >
      <Tab.Screen name={SWITCH_SCREENS.CAMERA} component={NotImplemented} />
      <Tab.Screen name={SWITCH_SCREENS.HOME} component={HomeStackNavigator} />
      <Tab.Screen name={SWITCH_SCREENS.DIRECT} component={DirectScreen} />
    </Tab.Navigator>
  );
}
