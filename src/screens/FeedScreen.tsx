import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { PostItem } from '../components/post-item/PostItem';
import { useAppDispatch } from '../redux/hooks';
import { postsActions, postsSelectors } from '../redux/posts';

export function FeedScreen(): JSX.Element {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(postsActions.getPosts());
  }, [dispatch]);

  const posts = postsSelectors.usePostsSelector();

  return (
    <Container>
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
