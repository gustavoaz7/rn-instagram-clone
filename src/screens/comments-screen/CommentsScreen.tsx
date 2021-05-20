import React, { useCallback } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { Comment } from '../../components/comment';
import { THomeStackParams } from '../../navigation/HomeStackNavigator';
import { HOME_STACK_SCREENS } from '../../navigation/screens';
import { TComment } from '../../types';

type CommentsScreenNavigationProp = StackNavigationProp<
  THomeStackParams,
  HOME_STACK_SCREENS.COMMENTS
>;

export type CommentsScreenRouteProp = RouteProp<
  THomeStackParams,
  HOME_STACK_SCREENS.COMMENTS
>;

export function CommentsScreen(): JSX.Element {
  const route = useRoute<CommentsScreenRouteProp>();
  const { post } = route.params;

  const renderItem = useCallback<ListRenderItem<TComment>>(
    ({ item }) => <Comment {...item} />,
    [],
  );
  const keyExtractor = useCallback((item: TComment) => item.id, []);
  const ListHeaderComponent = useCallback(
    () =>
      post.caption ? (
        <HeaderContainer>
          <Comment
            {...{
              id: post.id,
              owner: post.owner,
              likedBy: post.likedBy,
              createdAt: post.createdAt,
              text: post.caption,
            }}
            interactable={false}
          />
        </HeaderContainer>
      ) : null,
    [post],
  );

  return (
    <FlatList
      data={post.comments}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}

const HeaderContainer = styled.View`
  padding-right: ${({ theme }) => theme.spacing.xl};
  border-color: ${({ theme }) => theme.color.gray};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
`;
