import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Pressable } from 'react-native';
import { BottomTabNavigator } from './BottomTabNavigator';
import LogoText from '../../assets/svg/logo-text.svg';
import PlusRound from '../../assets/svg/plus-round.svg';
import Heart from '../../assets/svg/heart.svg';
import Direct from '../../assets/svg/direct.svg';
import { DIRECT_STACK_SCREENS } from './DirectStackNavigator';

export enum HOME_STACK_SCREENS {
  HOME = '@Home-Stack/Home',
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
  const navigation = useNavigation();

  return (
    <View style={styles.rightContainer}>
      <PlusRound
        width={24}
        height={24}
        color="black"
        style={styles.rightElement}
      />
      <Heart width={24} height={24} color="black" style={styles.rightElement} />
      <Pressable
        onPress={() => navigation.navigate(DIRECT_STACK_SCREENS.DIRECT)}
        style={styles.rightElement}
      >
        <Direct width={24} height={24} color="black" />
      </Pressable>
    </View>
  );
}

const Stack = createStackNavigator();

export function HomeStackNavigator(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={HOME_STACK_SCREENS.HOME}
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
