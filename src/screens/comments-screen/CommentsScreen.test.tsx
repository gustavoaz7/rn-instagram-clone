import React from 'react';
import { render } from '@testing-library/react-native';
import { useRoute } from '@react-navigation/native';
import { CommentsScreen } from './CommentsScreen';
import { Providers } from '../../Providers';
import { createMockPost } from '../../data/post';

jest.mock('@react-navigation/native');

describe('screens - CommentsScreen', () => {
  const post = createMockPost();
  const options = { wrapper: Providers };
  const useRouteSpy = useRoute as jest.Mock;
  useRouteSpy.mockReturnValue({ params: { post } });

  it('renders', async () => {
    render(<CommentsScreen />, options);
  });

  describe('when post has caption', () => {
    it('renders all comments and caption as comment', () => {
      const { getAllByTestId } = render(<CommentsScreen />, options);

      expect(getAllByTestId('Comment')).toHaveLength(post.comments.length + 1);
    });
  });

  describe('when post does not have caption', () => {
    const captionlessPost = { ...post, caption: null };
    beforeEach(() => {
      useRouteSpy.mockReturnValueOnce({ params: { post: captionlessPost } });
    });

    it('renders all comments and caption as comment', () => {
      const { getAllByTestId } = render(<CommentsScreen />, options);

      expect(getAllByTestId('Comment')).toHaveLength(post.comments.length);
    });
  });
});
