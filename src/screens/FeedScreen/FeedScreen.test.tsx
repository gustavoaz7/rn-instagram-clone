import React from 'react';
import { render } from '@testing-library/react-native';
import Toast from 'react-native-root-toast';
import { FeedScreen } from './FeedScreen';
import { Providers } from '../../Providers';
import * as reduxPosts from '../../redux/posts';
import * as reduxHooks from '../../redux/hooks';
import { createMockPost } from '../../data/post';

describe('screens - FeedScreen', () => {
  const dispatchMock = jest.fn();
  const useDispatchSpy = jest
    .spyOn(reduxHooks, 'useAppDispatch')
    .mockReturnValue(dispatchMock);
  const useSelectorSpy = jest
    .spyOn(reduxPosts, 'usePostsSelector')
    .mockReturnValue(reduxPosts.initialState);
  const toastSpy = jest.spyOn(Toast, 'show');

  beforeEach(() => {
    dispatchMock.mockReset();
  });

  afterAll(() => {
    useDispatchSpy.mockRestore();
    useSelectorSpy.mockRestore();
    toastSpy.mockRestore();
  });

  it('renders', async () => {
    render(<FeedScreen />, { wrapper: Providers });
  });

  it('dispatches get posts action', () => {
    const action = Math.random();
    const getPostsSpy = jest
      .spyOn(reduxPosts.postsActions, 'getPosts')
      .mockReturnValue(action as any);
    render(<FeedScreen />, { wrapper: Providers });

    expect(getPostsSpy).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(action);
    getPostsSpy.mockRestore();
  });

  describe('when posts are loading', () => {
    beforeEach(() => {
      useSelectorSpy.mockReturnValueOnce({
        ...reduxPosts.initialState,
        loading: true,
      });
    });

    it('renders loading', () => {
      const { getByTestId } = render(<FeedScreen />, { wrapper: Providers });

      expect(getByTestId('loadingPosts')).toBeTruthy();
    });
  });

  describe('when posts succeeds', () => {
    const posts = [createMockPost(), createMockPost()];

    beforeEach(() => {
      useSelectorSpy.mockReturnValueOnce({ ...reduxPosts.initialState, posts });
    });

    it('renders post items', () => {
      const { getAllByTestId } = render(<FeedScreen />, {
        wrapper: Providers,
      });

      expect(getAllByTestId('PostItem')).toHaveLength(posts.length);
    });
  });

  describe('when posts fails', () => {
    beforeEach(() => {
      useSelectorSpy.mockReturnValueOnce({
        ...reduxPosts.initialState,
        error: 'fail',
      });
    });

    it('shows toast', () => {
      render(<FeedScreen />, { wrapper: Providers });

      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining(''), {
        position: Toast.positions.CENTER,
      });
    });
  });
});
