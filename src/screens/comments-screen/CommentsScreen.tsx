import React, { useCallback, useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import styled, { useTheme } from 'styled-components/native';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { Comment } from '../../components/comment';
import { TRootStackParams } from '../../navigation/RootStackNavigator';
import { ROOT_STACK_SCREENS } from '../../navigation/screens';
import { TComment } from '../../types';
import { CommentInput } from '../../components/comment-input';
import { useAppDispatch } from '../../redux/hooks';
import { commentsActions, useCommentsSelector } from '../../redux/comments';

type CommentsScreenNavigationProp = StackNavigationProp<
  TRootStackParams,
  ROOT_STACK_SCREENS.COMMENTS
>;

export type CommentsScreenRouteProp = RouteProp<
  TRootStackParams,
  ROOT_STACK_SCREENS.COMMENTS
>;

export const COMMENTS_LIMIT = 20;

export function CommentsScreen(): JSX.Element {
  const route = useRoute<CommentsScreenRouteProp>();
  const { post } = route.params;
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const {
    comments,
    loading: loadingComments,
    error: errorComments,
    canFetchMoreComments,
  } = useCommentsSelector();

  const getComments = useCallback(() => {
    if (canFetchMoreComments && !loadingComments) {
      dispatch(
        commentsActions.getComments({
          postId: post.id,
          offset,
          limit: COMMENTS_LIMIT,
        }),
      );
      setOffset(offset + COMMENTS_LIMIT);
    }
  }, [canFetchMoreComments, loadingComments, dispatch, offset, post.id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setOffset(0);
    await dispatch(
      commentsActions.getComments({
        postId: post.id,
        offset: 0,
        limit: COMMENTS_LIMIT,
        refresh: true,
      }),
    );
    setRefreshing(false);
  }, [dispatch, post.id]);

  const LoadingComments = useCallback(
    () => (loadingComments ? <Loading testID="LoadingComments" /> : null),
    [loadingComments],
  );

  useEffect(() => {
    getComments();

    return () => {
      dispatch(commentsActions.clearComments());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // didMount

  useEffect(() => {
    if (errorComments) {
      Toast.show('Failed fetching comments.', {
        position: Toast.positions.CENTER,
      });
    }
  }, [errorComments]);

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
        data={comments}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={LoadingComments}
        onEndReachedThreshold={2}
        onEndReached={getComments}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.color.gray}
            colors={[theme.color.gray]}
          />
        }
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

const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
  size: 'large',
  color: theme.color.gray,
}))``;
