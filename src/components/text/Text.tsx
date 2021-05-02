import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import styled from 'styled-components/native';

type Props = Omit<TextProps, 'style'> & {
  children: React.ReactNode;
};

export function Text({ children, ...props }: Props): JSX.Element {
  return <StyledText {...props}>{children}</StyledText>;
}

const StyledText = styled(RNText)`
  color: ${({ theme }) => theme.color.black};
`;
