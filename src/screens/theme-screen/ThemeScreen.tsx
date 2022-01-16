import React, { useCallback } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Text } from '../../components/text';
import CheckSvg from '../../../assets/svg/check.svg';
import { useAppDispatch } from '../../redux/hooks';
import {
  themeVariantActions,
  useThemeVariantSelector,
} from '../../redux/theme-variant';
import { THEME_VARIANTS } from '../../styles/theme';

export const ThemeScreen = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const themeVariant = useThemeVariantSelector();

  const handleThemeChange = useCallback(
    (variant: THEME_VARIANTS) => {
      dispatch(themeVariantActions.changeVariant(variant));
    },
    [dispatch],
  );

  return (
    <View>
      <ThemeOption onPress={() => handleThemeChange(THEME_VARIANTS.LIGHT)}>
        <Text>Light</Text>
        <RadioIcon active={THEME_VARIANTS.LIGHT === themeVariant} />
      </ThemeOption>
      <ThemeOption onPress={() => handleThemeChange(THEME_VARIANTS.DARK)}>
        <Text>Dark</Text>
        <RadioIcon active={THEME_VARIANTS.DARK === themeVariant} />
      </ThemeOption>
    </View>
  );
};

type TRadioIconProps = { active?: boolean };
const RadioIcon = ({ active }: TRadioIconProps): JSX.Element => {
  return (
    <RadioIconContainer active={active}>
      <Check />
    </RadioIconContainer>
  );
};

const ThemeOption = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.m};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RadioIconContainer = styled.View<{ active?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.color.foreground};
  ${({ active, theme: { color } }) =>
    active
      ? `
        border-color: ${color.lightBlue};
        background-color: ${color.lightBlue};
      `
      : ''}
`;

const Check = styled(CheckSvg).attrs(({ theme }) => ({
  width: 16,
  height: 16,
  color: theme.color.background,
}))``;
