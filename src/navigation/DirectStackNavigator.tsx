import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import styled, { useTheme } from 'styled-components/native';
import { NotImplemented } from '../screens/NotImplemented';
import Video from '../../assets/svg/video.svg';
import Edit from '../../assets/svg/edit.svg';
import { DIRECT_STACK_SCREENS } from './screens';
import type { THomeSwipeNavigationProps } from './HomeSwipeNavigator';
import { ArrowBack } from './ArrowBack';
import { useUserSelector } from '../redux/user';

export type TDirectStackParams = Record<DIRECT_STACK_SCREENS, undefined>;

export type TDirectStackNavigationProps = CompositeNavigationProp<
  StackNavigationProp<TDirectStackParams>,
  THomeSwipeNavigationProps
>;

function HeaderRight() {
  const navigation = useNavigation<TDirectStackNavigationProps>();
  const theme = useTheme();

  return (
    <HeaderRightContainer>
      <RightIconContainer
        onPress={() => navigation.navigate(DIRECT_STACK_SCREENS.VIDEO)}
      >
        <Video color={theme.color.foreground} />
      </RightIconContainer>
      <RightIconContainer
        onPress={() => navigation.navigate(DIRECT_STACK_SCREENS.MESSAGE)}
      >
        <Edit color={theme.color.foreground} />
      </RightIconContainer>
    </HeaderRightContainer>
  );
}

const Stack = createStackNavigator<TDirectStackParams>();

export function DirectStackNavigator(): JSX.Element {
  const user = useUserSelector();

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerLeft: ArrowBack,
      }}
    >
      <Stack.Screen
        name={DIRECT_STACK_SCREENS.DIRECT}
        component={NotImplemented}
        options={{
          headerTitle: user.user?.username,
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

const HeaderRightContainer = styled.View`
  flex-direction: row;
`;

const RightIconContainer = styled.Pressable`
  margin-right: ${({ theme }) => theme.spacing.l};
`;
