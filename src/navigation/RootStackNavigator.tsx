import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import { Animated } from 'react-native';
import { HomeSwipeNavigator } from './HomeSwipeNavigator';
import { CommentsScreen } from '../screens/comments-screen';
import { ROOT_STACK_SCREENS } from './screens';
import type { TPost, TStory } from '../types';
import { ArrowBack } from './ArrowBack';
import { StoryScreen } from '../screens/StoryScreen';
import { SettingsBottomSheetScreen } from '../screens/SettingsBottomSheetScreen';

export type TRootStackParams = {
  [ROOT_STACK_SCREENS.HOME_SWIPE]: undefined;
  [ROOT_STACK_SCREENS.COMMENTS]: { post: TPost };
  [ROOT_STACK_SCREENS.STORY]: { id: string; story?: TStory };
  [ROOT_STACK_SCREENS.SETTINGS_BOTTOM_SHEET]: undefined;
};

export type THomeStackNavigationProps = StackNavigationProp<TRootStackParams>;

const Stack = createStackNavigator<TRootStackParams>();

export function RootStackNavigator(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerLeft: ArrowBack,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Stack.Screen
        name={ROOT_STACK_SCREENS.HOME_SWIPE}
        component={HomeSwipeNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROOT_STACK_SCREENS.COMMENTS}
        component={CommentsScreen}
        options={{
          title: 'Comments',
        }}
      />
      <Stack.Screen
        name={ROOT_STACK_SCREENS.STORY}
        component={StoryScreen}
        options={{
          ...TransitionPresets.ModalTransition,
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name={ROOT_STACK_SCREENS.SETTINGS_BOTTOM_SHEET}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          headerShown: false,
          cardOverlayEnabled: true,
          cardStyle: { backgroundColor: 'transparent' },
          cardStyleInterpolator: ({ current, inverted, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateY: Animated.multiply(
                    current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                      extrapolate: 'clamp',
                    }),
                    inverted,
                  ),
                },
              ],
            },
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3],
                extrapolate: 'clamp',
              }),
            },
          }),
          detachPreviousScreen: false,
        }}
        component={SettingsBottomSheetScreen}
      />
    </Stack.Navigator>
  );
}
