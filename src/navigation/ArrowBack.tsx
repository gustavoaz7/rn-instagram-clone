import React from 'react';
import { useNavigation } from '@react-navigation/native';
import styled, { useTheme } from 'styled-components/native';
import ArrowLeft from '../../assets/svg/arrow-left.svg';

export function ArrowBack(): JSX.Element {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <ArrowContainer onPress={navigation.goBack}>
      <ArrowLeft color={theme.color.foreground} />
    </ArrowContainer>
  );
}

const ArrowContainer = styled.Pressable`
  margin-left: ${({ theme }) => theme.spacing.l};
`;
