import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  useNavigation,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { View, StyleSheet, Pressable } from 'react-native';
import LogoText from '../../assets/svg/logo-text.svg';
import PlusRound from '../../assets/svg/plus-round.svg';
import Heart from '../../assets/svg/heart.svg';
import Direct from '../../assets/svg/direct.svg';
import {
  DIRECT_STACK_SCREENS,
  HOME_STACK_SCREENS,
  HOME_SWIPE_SCREENS,
} from './screens';
import type { THomeSwitchParams } from './HomeSwipeNavigator';
import { NotImplemented } from '../screens/NotImplemented';
import { FeedScreen } from '../screens/FeedScreen';

export type THomeStackParams = {
  [HOME_STACK_SCREENS.FEED]: undefined;
  [HOME_STACK_SCREENS.PROFILE]: undefined;
};

export type THomeStackNavigationProps = CompositeNavigationProp<
  StackNavigationProp<THomeStackParams>,
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
  const navigation = useNavigation<THomeStackNavigationProps>();

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
        onPress={() =>
          navigation.navigate(HOME_SWIPE_SCREENS.DIRECT, {
            screen: DIRECT_STACK_SCREENS.DIRECT,
          })
        }
        style={styles.rightElement}
      >
        <Direct width={24} height={24} color="black" />
      </Pressable>
    </View>
  );
}

const Stack = createStackNavigator<THomeStackParams>();

export function HomeStackNavigator(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={HOME_STACK_SCREENS.FEED}
        component={FeedScreen}
        options={{
          headerTitle: nullFn,
          headerLeft: HeaderLeft,
          headerRight: HeaderRight,
        }}
      />
      <Stack.Screen
        name={HOME_STACK_SCREENS.PROFILE}
        component={NotImplemented}
      />
    </Stack.Navigator>
  );
}
