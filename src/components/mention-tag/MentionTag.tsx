import React, { memo, useCallback } from 'react';
import styled from 'styled-components/native';
import { Text } from '../text';
import { TTappableObject } from '../../types';

export type TMentionTagProps = Pick<
  TTappableObject,
  'rotation' | 'scale' | 'text'
> & {
  onPress?: (text: string) => void;
};

export const MentionTag = memo(function MentionTag({
  rotation,
  scale,
  text,
  onPress,
}: TMentionTagProps): JSX.Element {
  const handlePress = useCallback(() => {
    onPress?.(text);
  }, [onPress, text]);

  return (
    <Container
      testID="MentionTag"
      onPress={handlePress}
      {...{ rotation, scale }}
    >
      <WhiteText>{text}</WhiteText>
    </Container>
  );
});

const Container = styled.Pressable<
  Pick<TMentionTagProps, 'rotation' | 'scale'>
>`
  border-radius: 6px;
  ${({ scale, theme }) => `
    transform: scale(${scale});
    padding: ${theme.spacing.s};
    background-color: #00000080;
  `}
`;

const WhiteText = styled(Text)`
  color: white;
`;
