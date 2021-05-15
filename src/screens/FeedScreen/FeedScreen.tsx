import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import Toast from 'react-native-root-toast';
import { PostItem } from '../../components/post-item/PostItem';
import { useAppDispatch } from '../../redux/hooks';
import { postsActions, usePostsSelector } from '../../redux/posts';

export function FeedScreen(): JSX.Element {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(postsActions.getPosts());
  }, [dispatch]);

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
      {loadingPosts ? <Loading testID="loadingPosts" /> : null}
      {posts.length ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostItem {...item} />}
          keyExtractor={item => item.id}
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
