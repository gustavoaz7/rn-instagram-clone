import React, { useCallback, useEffect, useState } from 'react';
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
import { fetchComments, TRemoteComments } from '../../services/comments';
import {
  isPending,
  isSuccess,
  makePending,
  makeUninitialized,
} from '../../utils/remote-data';

export type CommentsScreenRouteProp = RouteProp<
  TRootStackParams,
  ROOT_STACK_SCREENS.COMMENTS
>;

export const COMMENTS_LIMIT = 20;

export function CommentsScreen(): JSX.Element {
  const route = useRoute<CommentsScreenRouteProp>();
  const { post } = route.params;
  const theme = useTheme();
  const [canFetchComments, setCanFetchComments] = useState(true);
  const [remoteComments, setRemoteComments] = useState<TRemoteComments>(
    makeUninitialized(),
  );
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const getComments = useCallback(
    async (refresh = false) => {
      const actualOffset = refresh ? 0 : offset;
      setRemoteComments(makePending(refresh ? null : remoteComments.data));
      const remote = await fetchComments(post.id, {
        offset: actualOffset,
        limit: COMMENTS_LIMIT,
        refresh,
      });

      if (isSuccess(remote)) {
        setRemoteComments(prevRemote =>
          refresh
            ? remote
            : {
                ...remote,
                data: {
                  ...remote.data,
                  comments: [
                    ...(prevRemote.data?.comments || []),
                    ...remote.data.comments,
                  ],
                },
              },
        );
        setCanFetchComments(remote.data.canFetchMoreComments);
        setOffset(actualOffset + COMMENTS_LIMIT);
      } else {
        Toast.show('Failed fetching comments.', {
          position: Toast.positions.CENTER,
        });
      }
    },
    [remoteComments, offset, post.id],
  );

  const getMoreComments = useCallback(async () => {
    if (canFetchComments && !isPending(remoteComments)) {
      getComments();
    }
  }, [canFetchComments, remoteComments, getComments]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await getComments(true);
    setRefreshing(false);
  }, [getComments]);

  const LoadingComments = useCallback(
    () =>
      isPending(remoteComments) ? <Loading testID="LoadingComments" /> : null,
    [remoteComments],
  );

  useEffect(() => {
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // didMount

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
              viewerHasLiked: false,
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
        data={remoteComments.data?.comments || []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={LoadingComments}
        onEndReachedThreshold={2}
        onEndReached={getMoreComments}
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
}))`
  padding: ${({ theme }) => theme.spacing.s};
`;
