import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HomeStackNavigator } from './HomeStackNavigator';
import { DirectStackNavigator } from './DirectStackNavigator';
import { NotImplemented } from '../screens/NotImplemented';

export enum HOME_SWITCH_SCREENS {
  CAMERA = '@Home-Switch/Camera',
  HOME = '@Home-Switch/Home',
  DIRECT = '@Home-Switch/Direct',
}

function nullFn() {
  return null;
}

const Tab = createMaterialTopTabNavigator();

export function HomeSwitchNavigator(): JSX.Element {
  return (
    <Tab.Navigator
      initialRouteName={HOME_SWITCH_SCREENS.HOME}
      backBehavior="initialRoute"
      tabBar={nullFn}
    >
      <Tab.Screen
        name={HOME_SWITCH_SCREENS.CAMERA}
        component={NotImplemented}
      />
      <Tab.Screen
        name={HOME_SWITCH_SCREENS.HOME}
        component={HomeStackNavigator}
      />
      <Tab.Screen
        name={HOME_SWITCH_SCREENS.DIRECT}
        component={DirectStackNavigator}
      />
    </Tab.Navigator>
  );
}
