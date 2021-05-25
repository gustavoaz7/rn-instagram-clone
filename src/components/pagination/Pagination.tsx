import React from 'react';
import { ViewProps } from 'react-native';
import styled from 'styled-components/native';

export type TPaginationProps = {
  total: number;
  current: number;
  style?: ViewProps['style'];
};

export const Pagination = ({
  total,
  current,
  style,
}: TPaginationProps): JSX.Element => {
  return (
    <Container style={style}>
      {[...Array(total)].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Dot key={`dot-${i}`} active={i === current} testID="Pagination-Dot" />
      ))}
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
`;

const Dot = styled.View<{ active: boolean }>`
  ${({ theme: { color }, active }) => `
    width: ${active ? 6 : 5}px;
    height: ${active ? 6 : 5}px;
    border-radius: ${active ? 6 : 5}px;
    background-color: ${active ? color.lightBlue : color.gray};
    margin: 0 2px;
  `}
`;
