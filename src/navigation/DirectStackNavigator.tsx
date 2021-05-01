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

function HeaderLeft() {
  const navigation = useNavigation<TDirectStackNavigationProps>();

  return (
    <ArrowContainer onPress={navigation.goBack}>
      <ArrowLeft color="black" />
    </ArrowContainer>
  );
}

function HeaderRight() {
  const navigation = useNavigation<TDirectStackNavigationProps>();
  const theme = useTheme();

  return (
    <HeaderRightContainer>
      <RightIconContainer
        onPress={() => navigation.navigate(DIRECT_STACK_SCREENS.VIDEO)}
      >
        <Video color={theme.color.black} />
      </RightIconContainer>
      <RightIconContainer
        onPress={() => navigation.navigate(DIRECT_STACK_SCREENS.MESSAGE)}
      >
        <Edit color={theme.color.black} />
      </RightIconContainer>
    </HeaderRightContainer>
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

const ArrowContainer = styled.Pressable`
  margin-left: ${({ theme }) => theme.spacing.l};
`;

const HeaderRightContainer = styled.View`
  flex-direction: row;
`;

const RightIconContainer = styled.Pressable`
  margin-right: ${({ theme }) => theme.spacing.l};
`;
