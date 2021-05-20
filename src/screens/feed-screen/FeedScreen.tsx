import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import Toast from 'react-native-root-toast';
import { PostItem } from '../../components/post-item';
import { useAppDispatch } from '../../redux/hooks';
import { postsActions, usePostsSelector } from '../../redux/posts';
import { TPost } from '../../types';

export const POSTS_LIMIT = 20;

export function FeedScreen(): JSX.Element {
  const dispatch = useAppDispatch();
  const [offset, setOffset] = useState(0);

  const {
    posts,
    loading: loadingPosts,
    error: errorPosts,
    canFetchMorePosts,
  } = usePostsSelector();

  const getPosts = useCallback(() => {
    if (canFetchMorePosts) {
      dispatch(postsActions.getPosts({ offset, limit: POSTS_LIMIT }));
      setOffset(offset + POSTS_LIMIT);
    }
  }, [canFetchMorePosts, dispatch, offset]);

  const LoadingMorePosts = useCallback(
    () => (loadingPosts ? <Loading testID="loadingMorePosts" /> : null),
    [loadingPosts],
  );

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // didMount

  useEffect(() => {
    if (errorPosts) {
      Toast.show('Failed fetching posts.', {
        position: Toast.positions.CENTER,
      });
    }
  }, [errorPosts]);

  const renderItem = useCallback<ListRenderItem<TPost>>(
    ({ item }) => <PostItem {...item} />,
    [],
  );
  const keyExtractor = useCallback((item: TPost) => item.id, []);

  return (
    <Container>
      {loadingPosts && !posts.length ? <Loading testID="loadingPosts" /> : null}
      {posts.length ? (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          maxToRenderPerBatch={4}
          onEndReached={getPosts}
          onEndReachedThreshold={2}
          ListFooterComponent={LoadingMorePosts}
        />
      ) : null}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
`;

const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
  size: 'large',
  color: theme.color.gray,
}))``;
