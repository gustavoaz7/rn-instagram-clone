import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import styled, { useTheme } from 'styled-components/native';
import PlusRoundSvg from '../../assets/svg/plus-round.svg';
import MenuSvg from '../../assets/svg/menu-hamburger.svg';
import { PROFILE_STACK_SCREENS, ROOT_STACK_SCREENS } from './screens';
import type { TBottomTabNavigationProps } from './BottomTabNavigator';
import { ArrowBack } from './ArrowBack';
import { ProfileScreen } from '../screens/profile-screen';
import { Text } from '../components/text';
import { useUserSelector } from '../redux/user';
import { SettingsScreen } from '../screens/settings-screen';
import { ThemeScreen } from '../screens/theme-screen';

export type TProfileStackParams = {
  [PROFILE_STACK_SCREENS.PROFILE]: { username: string };
  [PROFILE_STACK_SCREENS.SETTINGS]: undefined;
  [PROFILE_STACK_SCREENS.THEME]: undefined;
};

export type TProfileStackNavigationProps = CompositeNavigationProp<
  StackNavigationProp<TProfileStackParams>,
  TBottomTabNavigationProps
>;

function nullFn() {
  return null;
}

function HeaderLeft() {
  const { user } = useUserSelector();

  return <Username>{user?.username}</Username>;
}

function HeaderRight() {
  const theme = useTheme();
  const navigation = useNavigation<TProfileStackNavigationProps>();

  return (
    <HeaderRightContainer>
      <IconContainer>
        <PlusRoundSvg color={theme.color.black} width={28} height={28} />
      </IconContainer>
      <IconContainer
        onPress={() =>
          navigation.navigate(ROOT_STACK_SCREENS.PROFILE_BOTTOM_SHEET)
        }
      >
        <MenuSvg color={theme.color.black} width={28} height={28} />
      </IconContainer>
    </HeaderRightContainer>
  );
}

const Stack = createStackNavigator<TProfileStackParams>();

export function ProfileStackNavigator(): JSX.Element {
  const { user } = useUserSelector();

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
        name={PROFILE_STACK_SCREENS.PROFILE}
        component={ProfileScreen}
        initialParams={{ username: user?.username }}
        options={{
          headerTitle: nullFn,
          headerLeft: HeaderLeft,
          headerRight: HeaderRight,
        }}
      />
      <Stack.Screen
        name={PROFILE_STACK_SCREENS.SETTINGS}
        component={SettingsScreen}
        options={{
          headerTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name={PROFILE_STACK_SCREENS.THEME}
        component={ThemeScreen}
        options={{
          headerTitle: 'Set Theme',
        }}
      />
    </Stack.Navigator>
  );
}

const Username = styled(Text)`
  margin-left: ${({ theme }) => theme.spacing.l};
  font-weight: bold;
  font-size: ${({ theme }) => theme.font.size.xl};
`;

const HeaderRightContainer = styled.View`
  flex-direction: row;
`;

const IconContainer = styled.Pressable`
  margin-right: ${({ theme }) => theme.spacing.l};
`;
