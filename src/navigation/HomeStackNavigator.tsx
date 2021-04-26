import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import { BottomTabNavigator } from './BottomTabNavigator';
import LogoText from '../../assets/svg/logo-text.svg';
import PlusRound from '../../assets/svg/plus-round.svg';
import Heart from '../../assets/svg/heart.svg';
import Direct from '../../assets/svg/direct.svg';

export enum STACK_SCREENS {
  HOME = '@Stack/Home',
}

const styles = StyleSheet.create({
  leftContainer: {
    marginLeft: 20,
  },
  rightContainer: {
    flexDirection: 'row',
  },
  rightElement: {
    marginRight: 20,
  },
});

function nullFn() {
  return null;
}

function HeaderLeft() {
  return (
    <View style={styles.leftContainer}>
      <LogoText width={106} height={30} color="black" />
    </View>
  );
}

function HeaderRight() {
  return (
    <View style={styles.rightContainer}>
      <PlusRound
        width={24}
        height={24}
        color="black"
        style={styles.rightElement}
      />
      <Heart width={24} height={24} color="black" style={styles.rightElement} />
      <Direct
        width={24}
        height={24}
        color="black"
        style={styles.rightElement}
      />
    </View>
  );
}

const Stack = createStackNavigator();

export function HomeStackNavigator(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={STACK_SCREENS.HOME}
        component={BottomTabNavigator}
        options={{
          headerTitle: nullFn,
          headerLeft: HeaderLeft,
          headerRight: HeaderRight,
        }}
      />
    </Stack.Navigator>
  );
}
