import React from 'react';
import { FlatList } from 'react-native';
import { render, act } from '@testing-library/react-native';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import { CommentsScreen, COMMENTS_LIMIT } from './CommentsScreen';
import { Providers } from '../../Providers';
import { generateMockPost, generateMockComment } from '../../data';
import * as reduxComments from '../../redux/comments';
import * as reduxHooks from '../../redux/hooks';
import { FakeNavigator } from '../../test/fake-navigator';

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useRoute: jest.fn(actual.useRoute),
  };
});

describe('screens - CommentsScreen', () => {
  const post = generateMockPost();
  const options = { wrapper: Providers };
  const useRouteSpy = useRoute as jest.Mock;
  const dispatchMock = jest.fn();
  const useDispatchSpy = jest
    .spyOn(reduxHooks, 'useAppDispatch')
    .mockReturnValue(dispatchMock);
  const useSelectorSpy = jest
    .spyOn(reduxComments, 'useCommentsSelector')
    .mockReturnValue(reduxComments.initialState);
  const getCommentsSpy = jest.spyOn(
    reduxComments.commentsActions,
    'getComments',
  );
  const clearCommentsSpy = jest.spyOn(
    reduxComments.commentsActions,
    'clearComments',
  );
  const toastSpy = jest.spyOn(Toast, 'show');

  beforeEach(() => {
    useRouteSpy.mockReturnValue({ params: { post } });
  });

  afterAll(() => {
    useDispatchSpy.mockRestore();
    useSelectorSpy.mockRestore();
    getCommentsSpy.mockRestore();
    toastSpy.mockRestore();
  });

  it('renders', async () => {
    render(<FakeNavigator component={CommentsScreen} />, options);
  });

  describe('when post has caption', () => {
    it('renders caption as comment', () => {
      const { getAllByTestId } = render(
        <FakeNavigator component={CommentsScreen} />,
        options,
      );

      expect(getAllByTestId('Comment')).toHaveLength(1);
    });
  });

  describe('when post does not have caption', () => {
    const captionlessPost = { ...post, caption: null };
    beforeEach(() => {
      useRouteSpy.mockReturnValue({ params: { post: captionlessPost } });
    });

    it('renders all comments and caption as comment', () => {
      const { queryAllByTestId } = render(
        <FakeNavigator component={CommentsScreen} />,
        options,
      );

      expect(queryAllByTestId('Comment')).toHaveLength(0);
    });
  });

  it('dispatches get comments action', () => {
    const action = Math.random();
    getCommentsSpy.mockReturnValueOnce(action as any);
    render(<FakeNavigator component={CommentsScreen} />, options);

    expect(getCommentsSpy).toHaveBeenCalledTimes(1);
    expect(getCommentsSpy).toHaveBeenCalledWith({
      postId: post.id,
      offset: 0,
      limit: COMMENTS_LIMIT,
    });
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(action);
  });

  describe('when comments are loading', () => {
    beforeEach(() => {
      useSelectorSpy.mockReturnValue({
        ...reduxComments.initialState,
        loading: true,
      });
    });

    it('renders loading', () => {
      const { queryByTestId } = render(
        <FakeNavigator component={CommentsScreen} />,
        options,
      );

      expect(queryByTestId('LoadingComments')).toBeTruthy();
    });
  });

  describe('when comments succeeds', () => {
    const comments = [generateMockComment(), generateMockComment()];

    beforeEach(() => {
      useSelectorSpy.mockReturnValue({
        ...reduxComments.initialState,
        comments,
      });
    });

    it('renders comments', () => {
      const { getAllByTestId } = render(
        <FakeNavigator component={CommentsScreen} />,
        options,
      );

      expect(getAllByTestId('Comment')).toHaveLength(comments.length + 1);
    });

    describe('when reaches the end of list', () => {
      beforeEach(() => {
        useSelectorSpy.mockReturnValue({
          ...reduxComments.initialState,
          loading: true,
          comments,
        });
      });

      it('dispatches a second get comments action', () => {
        useSelectorSpy.mockReturnValue({
          ...reduxComments.initialState,
          comments,
        });
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={CommentsScreen} />,
          options,
        );

        expect(getCommentsSpy).toHaveBeenCalledTimes(1);
        getCommentsSpy.mockReset();

        act(() => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        expect(getCommentsSpy).toHaveBeenCalledTimes(1);
        expect(getCommentsSpy).toHaveBeenCalledWith({
          postId: post.id,
          offset: COMMENTS_LIMIT,
          limit: COMMENTS_LIMIT,
        });
      });

      it('does not dispatches get comments when alerady loading', () => {
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={CommentsScreen} />,
          options,
        );

        act(() => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        expect(getCommentsSpy).not.toHaveBeenCalled();
      });

      it('rendes loading', async () => {
        const { queryByTestId } = render(
          <FakeNavigator component={CommentsScreen} />,
          options,
        );

        expect(queryByTestId('LoadingComments')).toBeTruthy();
      });

      describe('and there is no more comments to fetch', () => {
        beforeEach(() => {
          useSelectorSpy.mockReturnValue({
            ...reduxComments.initialState,
            comments,
            canFetchMoreComments: false,
          });
        });

        it('does not dispatches another get comments action', () => {
          const { UNSAFE_getByType } = render(
            <FakeNavigator component={CommentsScreen} />,
            options,
          );

          act(() => {
            UNSAFE_getByType(FlatList).props.onEndReached();
          });

          expect(getCommentsSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('when screen is unmounted', () => {
      it('dispatches clear comments action', () => {
        const action = Math.random();
        clearCommentsSpy.mockReturnValueOnce(action as any);
        const { unmount } = render(
          <FakeNavigator component={CommentsScreen} />,
          options,
        );

        unmount();

        expect(clearCommentsSpy).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenLastCalledWith(action);
      });
    });
  });

  describe('when posts fails', () => {
    beforeEach(() => {
      useSelectorSpy.mockReturnValueOnce({
        ...reduxComments.initialState,
        error: 'fail',
      });
    });

    it('shows toast', () => {
      render(<FakeNavigator component={CommentsScreen} />, options);

      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining(''), {
        position: Toast.positions.CENTER,
      });
    });
  });
});
