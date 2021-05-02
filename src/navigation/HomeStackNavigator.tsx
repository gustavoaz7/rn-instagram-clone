import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  useNavigation,
  CompositeNavigationProp,
} from '@react-navigation/native';
import styled, { useTheme } from 'styled-components/native';
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
import { ActivityScreen } from '../screens/ActivityScreen';
import { ArrowBack } from './ArrowBack';

export type THomeStackParams = {
  [HOME_STACK_SCREENS.FEED]: undefined;
  [HOME_STACK_SCREENS.ACTIVITY]: undefined;
  [HOME_STACK_SCREENS.PROFILE]: undefined;
};

export type THomeStackNavigationProps = CompositeNavigationProp<
  StackNavigationProp<THomeStackParams>,
  StackNavigationProp<THomeSwitchParams>
>;

function nullFn() {
  return null;
}

function HeaderLeft() {
  const theme = useTheme();

  return (
    <LogoContainer>
      <LogoText color={theme.color.black} />
    </LogoContainer>
  );
}

function HeaderRight() {
  const navigation = useNavigation<THomeStackNavigationProps>();
  const theme = useTheme();

  return (
    <HeaderRightContainer>
      <IconContainer>
        <PlusRound color={theme.color.black} />
      </IconContainer>
      <IconContainer
        onPress={() => navigation.navigate(HOME_STACK_SCREENS.ACTIVITY)}
      >
        <Heart color={theme.color.black} />
      </IconContainer>
      <IconContainer
        onPress={() =>
          navigation.navigate(HOME_SWIPE_SCREENS.DIRECT, {
            screen: DIRECT_STACK_SCREENS.DIRECT,
          })
        }
      >
        <Direct color={theme.color.black} />
      </IconContainer>
    </HeaderRightContainer>
  );
}

const Stack = createStackNavigator<THomeStackParams>();

export function HomeStackNavigator(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerLeft: ArrowBack,
      }}
    >
      <Stack.Screen
        name={HOME_STACK_SCREENS.FEED}
        component={FeedScreen}
        options={{
          headerTitle: nullFn,
          headerLeft: HeaderLeft,
          headerRight: HeaderRight,
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />
      <Stack.Screen
        name={HOME_STACK_SCREENS.ACTIVITY}
        component={ActivityScreen}
      />
      <Stack.Screen
        name={HOME_STACK_SCREENS.PROFILE}
        component={NotImplemented}
      />
    </Stack.Navigator>
  );
}

const LogoContainer = styled.View`
  margin-left: ${({ theme }) => theme.spacing.l};
`;

const HeaderRightContainer = styled.View`
  flex-direction: row;
`;

const IconContainer = styled.Pressable`
  margin-right: ${({ theme }) => theme.spacing.l};
`;
