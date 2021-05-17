import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import { Text } from 'react-native';
import { THomeStackParams } from '../navigation/HomeStackNavigator';
import { HOME_STACK_SCREENS } from '../navigation/screens';

type CommentsScreenNavigationProp = StackNavigationProp<
  THomeStackParams,
  HOME_STACK_SCREENS.COMMENTS
>;

type CommentsScreenRouteProp = RouteProp<
  THomeStackParams,
  HOME_STACK_SCREENS.COMMENTS
>;

export function CommentsScreen(): JSX.Element {
  const route = useRoute<CommentsScreenRouteProp>();
  const { post } = route.params;
  return (
    <Container>
      <Text>CommentsScreen</Text>
      <Text>{post.comments[0].text}</Text>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
