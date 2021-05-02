import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import styled from 'styled-components/native';

export interface TextProps extends RNTextProps {
  children?: React.ReactNode;
}

export function Text({ children, ...props }: TextProps): JSX.Element {
  return <StyledText {...props}>{children}</StyledText>;
}

const StyledText = styled(RNText)`
  color: ${({ theme }) => theme.color.black};
`;
