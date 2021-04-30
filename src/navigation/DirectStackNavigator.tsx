import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { DirectScreen } from '../screens/DirectScreen';
import { NotImplemented } from '../screens/NotImplemented';
import ArrowLeft from '../../assets/svg/arrow-left.svg';
import Video from '../../assets/svg/video.svg';
import Edit from '../../assets/svg/edit.svg';
import { DIRECT_STACK_SCREENS } from './screens';
import type { THomeSwitchParams } from './HomeSwipeNavigator';

export type TDirectStackParams = Record<DIRECT_STACK_SCREENS, undefined>;

export type TDirectStackNavigationProps = CompositeNavigationProp<
  StackNavigationProp<TDirectStackParams>,
  StackNavigationProp<THomeSwitchParams>
>;

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

function HeaderLeft() {
  const navigation = useNavigation<TDirectStackNavigationProps>();

  return (
    <Pressable onPress={navigation.goBack} style={styles.leftContainer}>
      <ArrowLeft width={24} height={24} color="black" />
    </Pressable>
  );
}

function HeaderRight() {
  const navigation = useNavigation<TDirectStackNavigationProps>();

  return (
    <View style={styles.rightContainer}>
      <Pressable
        onPress={() => navigation.navigate(DIRECT_STACK_SCREENS.VIDEO)}
        style={styles.rightElement}
      >
        <Video width={24} height={24} color="black" />
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate(DIRECT_STACK_SCREENS.MESSAGE)}
        style={styles.rightElement}
      >
        <Edit width={24} height={24} color="black" />
      </Pressable>
    </View>
  );
}

const Stack = createStackNavigator<TDirectStackParams>();

export function DirectStackNavigator(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerLeft: HeaderLeft,
      }}
    >
      <Stack.Screen
        name={DIRECT_STACK_SCREENS.DIRECT}
        component={DirectScreen}
        options={{
          headerTitle: 'Username',
          headerRight: HeaderRight,
        }}
      />
      <Stack.Screen
        name={DIRECT_STACK_SCREENS.VIDEO}
        component={NotImplemented}
      />
      <Stack.Screen
        name={DIRECT_STACK_SCREENS.MESSAGE}
        component={NotImplemented}
      />
      <Stack.Screen
        name={DIRECT_STACK_SCREENS.CHAT}
        component={NotImplemented}
      />
    </Stack.Navigator>
  );
}
