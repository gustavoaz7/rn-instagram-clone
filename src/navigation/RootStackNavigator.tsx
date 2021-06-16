import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import { HomeSwipeNavigator } from './HomeSwipeNavigator';
import { CommentsScreen } from '../screens/comments-screen';
import { ROOT_STACK_SCREENS } from './screens';
import { TPost } from '../types';
import { ArrowBack } from './ArrowBack';
import { StoryScreen } from '../screens/StoryScreen';

export type TRootStackParams = {
  [ROOT_STACK_SCREENS.HOME_SWIPE]: undefined;
  [ROOT_STACK_SCREENS.COMMENTS]: { post: TPost };
  [ROOT_STACK_SCREENS.STORY]: { username: string };
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
    </Stack.Navigator>
  );
}
