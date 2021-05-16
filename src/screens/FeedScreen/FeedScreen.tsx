import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import Toast from 'react-native-root-toast';
import { PostItem } from '../../components/post-item/PostItem';
import { useAppDispatch } from '../../redux/hooks';
import { postsActions, usePostsSelector } from '../../redux/posts';

export const POSTS_LIMIT = 20;

export function FeedScreen(): JSX.Element {
  const dispatch = useAppDispatch();
  const [offset, setOffset] = useState(0);

  const getPosts = useCallback(() => {
    dispatch(postsActions.getPosts({ offset, limit: POSTS_LIMIT }));
    setOffset(offset + POSTS_LIMIT);
  }, [dispatch, offset]);

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // didMount

  const {
    posts,
    loading: loadingPosts,
    error: errorPosts,
  } = usePostsSelector();

  useEffect(() => {
    if (errorPosts) {
      Toast.show('Failed fetching posts.', {
        position: Toast.positions.CENTER,
      });
    }
  }, [errorPosts]);

  return (
    <Container>
      {loadingPosts && !posts.length ? <Loading testID="loadingPosts" /> : null}
      {posts.length ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostItem {...item} />}
          keyExtractor={item => item.id}
          onEndReached={getPosts}
          onEndReachedThreshold={2}
          ListFooterComponent={() => <Loading testID="loadingMorePosts" />}
        />
      ) : null}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: ${({ theme }) => theme.color.white};
`;

const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
  size: 'large',
  color: theme.color.gray,
}))``;
