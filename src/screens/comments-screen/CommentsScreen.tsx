import React, { useCallback } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { Comment } from '../../components/comment';
import { TRootStackParams } from '../../navigation/RootStackNavigator';
import { ROOT_STACK_SCREENS } from '../../navigation/screens';
import { TComment } from '../../types';
import { CommentInput } from '../../components/comment-input';

type CommentsScreenNavigationProp = StackNavigationProp<
  TRootStackParams,
  ROOT_STACK_SCREENS.COMMENTS
>;

export type CommentsScreenRouteProp = RouteProp<
  TRootStackParams,
  ROOT_STACK_SCREENS.COMMENTS
>;

export function CommentsScreen(): JSX.Element {
  const route = useRoute<CommentsScreenRouteProp>();
  const { post } = route.params;

  const renderItem = useCallback<ListRenderItem<TComment>>(
    ({ item }) => <StyledComment {...item} />,
    [],
  );
  const keyExtractor = useCallback((item: TComment) => item.id, []);
  const ListHeaderComponent = useCallback(
    () =>
      post.caption ? (
        <HeaderContainer>
          <StyledComment
            {...{
              id: post.id,
              owner: post.owner,
              previewLikes: post.previewLikes,
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
    <Container>
      <FlatList
        data={post.previewComments.comments}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
      />
      <CommentInput
        onSubmit={() => {
          /* TODO */
        }}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const HeaderContainer = styled.View`
  padding-right: ${({ theme }) => theme.spacing.xl};
  border-color: ${({ theme }) => theme.color.gray};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
`;

const StyledComment = styled(Comment)`
  margin: ${({ theme }) => theme.spacing.s} 0;
`;
