import React from 'react';
import { act, render } from '@testing-library/react-native';
import Toast from 'react-native-root-toast';
import { FlatList } from 'react-native';
import { FeedScreen, POSTS_LIMIT } from './FeedScreen';
import { Providers } from '../../Providers';
import * as reduxPosts from '../../redux/posts';
import * as reduxHooks from '../../redux/hooks';
import { createMockPost } from '../../data/post';
import { FakeNavigator } from '../../test/fake-navigator';

describe('screens - FeedScreen', () => {
  const options = { wrapper: Providers };
  const dispatchMock = jest.fn();
  const useDispatchSpy = jest
    .spyOn(reduxHooks, 'useAppDispatch')
    .mockReturnValue(dispatchMock);
  const useSelectorSpy = jest
    .spyOn(reduxPosts, 'usePostsSelector')
    .mockReturnValue(reduxPosts.initialState);
  const getPostsSpy = jest.spyOn(reduxPosts.postsActions, 'getPosts');
  const toastSpy = jest.spyOn(Toast, 'show');

  afterAll(() => {
    useDispatchSpy.mockRestore();
    useSelectorSpy.mockRestore();
    getPostsSpy.mockRestore();
    toastSpy.mockRestore();
  });

  it('renders', async () => {
    render(<FakeNavigator component={FeedScreen} />, options);
  });

  it('dispatches get posts action', () => {
    const action = Math.random();
    getPostsSpy.mockReturnValueOnce(action as any);
    render(<FakeNavigator component={FeedScreen} />, options);

    expect(getPostsSpy).toHaveBeenCalledTimes(1);
    expect(getPostsSpy).toHaveBeenCalledWith({ offset: 0, limit: POSTS_LIMIT });
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(action);
  });

  describe('when posts are loading', () => {
    beforeEach(() => {
      useSelectorSpy.mockReturnValue({
        ...reduxPosts.initialState,
        loading: true,
      });
    });

    it('renders loading', () => {
      const { queryByTestId } = render(
        <FakeNavigator component={FeedScreen} />,
        options,
      );

      expect(queryByTestId('loadingPosts')).toBeTruthy();
      expect(queryByTestId('loadingMorePosts')).toBeFalsy();
    });
  });

  describe('when posts succeeds', () => {
    const posts = [createMockPost(), createMockPost()];

    beforeEach(() => {
      useSelectorSpy.mockReturnValue({ ...reduxPosts.initialState, posts });
    });

    it('renders post items', () => {
      const { getAllByTestId } = render(
        <FakeNavigator component={FeedScreen} />,
        options,
      );

      expect(getAllByTestId('PostItem')).toHaveLength(posts.length);
    });

    describe('when reaches the end of list', () => {
      beforeEach(() => {
        useSelectorSpy.mockReturnValue({
          ...reduxPosts.initialState,
          loading: true,
          posts,
        });
      });

      it('dispatches a second get posts action', () => {
        useSelectorSpy.mockReturnValue({
          ...reduxPosts.initialState,
          posts,
        });
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );

        expect(getPostsSpy).toHaveBeenCalledTimes(1);
        getPostsSpy.mockReset();

        act(() => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        expect(getPostsSpy).toHaveBeenCalledTimes(1);
        expect(getPostsSpy).toHaveBeenCalledWith({
          offset: POSTS_LIMIT,
          limit: POSTS_LIMIT,
        });
      });

      it('does not dispatches get posts when alerady loading', () => {
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );

        act(() => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        expect(getPostsSpy).not.toHaveBeenCalled();
      });

      it('rendes loading as footer of list', async () => {
        const { queryByTestId } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );

        expect(queryByTestId('loadingPosts')).toBeFalsy();
        expect(queryByTestId('loadingMorePosts')).toBeTruthy();
      });

      describe('and there is no more posts to fetch', () => {
        beforeEach(() => {
          useSelectorSpy.mockReturnValue({
            ...reduxPosts.initialState,
            posts,
            canFetchMorePosts: false,
          });
        });

        it('does not dispatches another get posts action', () => {
          const { UNSAFE_getByType } = render(
            <FakeNavigator component={FeedScreen} />,
            options,
          );

          act(() => {
            UNSAFE_getByType(FlatList).props.onEndReached();
          });

          expect(getPostsSpy).not.toHaveBeenCalled();
        });
      });
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
      render(<FakeNavigator component={FeedScreen} />, options);

      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining(''), {
        position: Toast.positions.CENTER,
      });
    });
  });
});
