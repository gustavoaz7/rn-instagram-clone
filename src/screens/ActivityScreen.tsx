import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';

export function ActivityScreen(): JSX.Element {
  return (
    <Container>
      <Text>ActivityScreen</Text>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
