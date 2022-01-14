import React, { useMemo, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { SvgProps } from 'react-native-svg';
import styled, { useTheme } from 'styled-components/native';
import UserPlusSvg from '../../../assets/svg/user-plus.svg';
import BellSvg from '../../../assets/svg/bell.svg';
import LockSvg from '../../../assets/svg/lock.svg';
import AccountSvg from '../../../assets/svg/account.svg';
import SecuritySvg from '../../../assets/svg/security.svg';
import HelpSvg from '../../../assets/svg/help.svg';
import AboutSvg from '../../../assets/svg/info-circle.svg';
import ThemeSvg from '../../../assets/svg/paint-palette.svg';
import { Text } from '../../components/text';

export const SettingsScreen = (): JSX.Element => {
  const theme = useTheme();

  const sharedSvgProps: SvgProps = useMemo(
    () => ({
      width: 28,
      height: 28,
      color: theme.color.black,
    }),
    [theme.color.black],
  );

  const goToTheme = useCallback(() => {
    // TODO - navigate to themes screen
  }, []);

  return (
    <ScrollView>
      <ItemTouchable disabled>
        <Item>
          <UserPlusSvg {...sharedSvgProps} />
          <ItemText>Follow and invite friends</ItemText>
        </Item>
      </ItemTouchable>
      <ItemTouchable disabled>
        <Item>
          <BellSvg {...sharedSvgProps} />
          <ItemText>Notifications</ItemText>
        </Item>
      </ItemTouchable>
      <ItemTouchable disabled>
        <Item>
          <LockSvg {...sharedSvgProps} />
          <ItemText>Privacy</ItemText>
        </Item>
      </ItemTouchable>
      <ItemTouchable disabled>
        <Item>
          <SecuritySvg {...sharedSvgProps} />
          <ItemText>Security</ItemText>
        </Item>
      </ItemTouchable>
      <ItemTouchable disabled>
        <Item>
          <AccountSvg {...sharedSvgProps} />
          <ItemText>Account</ItemText>
        </Item>
      </ItemTouchable>
      <ItemTouchable disabled>
        <Item>
          <HelpSvg {...sharedSvgProps} />
          <ItemText>Help</ItemText>
        </Item>
      </ItemTouchable>
      <ItemTouchable disabled>
        <Item>
          <AboutSvg {...sharedSvgProps} />
          <ItemText>About</ItemText>
        </Item>
      </ItemTouchable>
      <ItemTouchable onPress={goToTheme}>
        <Item>
          <ThemeSvg {...sharedSvgProps} />
          <ItemText>Theme</ItemText>
        </Item>
      </ItemTouchable>
    </ScrollView>
  );
};

const ItemTouchable = styled.TouchableHighlight.attrs(({ theme }) => ({
  underlayColor: `${theme.color.black}1A`,
}))``;

const Item = styled.View`
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
  flex-direction: row;
  align-items: center;
`;

const ItemText = styled(Text)`
  margin-left: ${({ theme }) => theme.spacing.s};
`;
