/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  render,
  RenderOptions,
  fireEvent,
  act,
} from '@testing-library/react-native';
import faker from 'faker';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import { PostItem } from './PostItem';
import { Providers } from '../../Providers';
import * as reduxHooks from '../../redux/hooks';
import * as reduxPosts from '../../redux/posts';
import * as reduxComments from '../../redux/comments';
import {
  generateMockPost,
  generateMockPostMedia,
  generateMockLike,
  generateMockComment,
} from '../../data';
import { ROOT_STACK_SCREENS } from '../../navigation/screens';
import { theme } from '../../styles/theme';
import {
  timeTravel,
  setupTimeTravel,
  destroyTimeTravel,
} from '../../test/time-travel';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
const useNavigationMock = useNavigation as jest.Mock;

describe('components - PostItem', () => {
  const dispatchMock = jest.fn();
  const useDispatchSpy = jest
    .spyOn(reduxHooks, 'useAppDispatch')
    .mockReturnValue(dispatchMock);
  const likePostSpy = jest.spyOn(reduxPosts.postsActions, 'likePost');
  const likeCommentSpy = jest.spyOn(
    reduxComments.commentsActions,
    'likeComment',
  );
  const post = generateMockPost();
  const multiCommentPost = {
    ...post,
    previewComments: {
      count: 2,
      comments: [...Array(2)].map(generateMockComment),
    },
  };
  const options: RenderOptions = { wrapper: Providers };

  afterAll(() => {
    dispatchMock.mockRestore();
    useDispatchSpy.mockRestore();
    likePostSpy.mockRestore();
  });

  it('renders', () => {
    render(<PostItem {...post} />, options);
  });

  it('matches snapshot', () => {
    const realDateNow = Date.now.bind(global.Date);
    const dateNowMock = jest.fn(() => multiCommentPost.createdAt + 3600 * 1000);
    global.Date.now = dateNowMock;

    const { toJSON } = render(<PostItem {...multiCommentPost} />, options);

    expect(toJSON()).toMatchSnapshot();
    global.Date.now = realDateNow;
  });

  it('inherits style', () => {
    const style = { backgroundColor: 'orange' };
    const { getByTestId } = render(
      <PostItem {...post} style={style} />,
      options,
    );

    expect(getByTestId('PostItem')).toHaveStyle(style);
  });

  it('renders without location', () => {
    const { location, ...rest } = post;
    render(<PostItem {...rest} />, options);
  });

  describe('likes', () => {
    it('renders without likes', () => {
      const previewLikes = { count: 0, likes: [] };
      render(<PostItem {...post} previewLikes={previewLikes} />, options);
    });

    it('renders singular when 1 like', () => {
      const previewLikes = { count: 1, likes: [generateMockLike()] };
      const { getByText } = render(
        <PostItem {...post} previewLikes={previewLikes} />,
        options,
      );

      expect(getByText('1 like')).toBeTruthy();
    });

    it('renders plural when > 2 likes', () => {
      const previewLikes = {
        count: 2,
        likes: [...Array(2).map(generateMockLike)],
      };
      const { getByText } = render(
        <PostItem {...post} previewLikes={previewLikes} />,
        options,
      );

      expect(getByText('2 likes')).toBeTruthy();
    });

    describe('when user has liked the post', () => {
      it('renders red heart', () => {
        const { getByTestId } = render(
          <PostItem {...post} viewerHasLiked />,
          options,
        );

        const heartIcon = getByTestId('PostItem-Heart');

        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);
      });

      describe('when user press heart icon', () => {
        it('dispatches likePost action with flag as `false`', async () => {
          const action = Math.random();
          likePostSpy.mockReturnValueOnce(action as any);
          const { getByTestId } = render(
            <PostItem {...post} viewerHasLiked />,
            options,
          );

          act(() => {
            fireEvent.press(getByTestId('PostItem-Heart'));
          });

          expect(likePostSpy).toHaveBeenCalledTimes(1);
          expect(likePostSpy).toHaveBeenCalledWith({
            id: post.id,
            flag: false,
          });
          expect(dispatchMock).toHaveBeenCalledTimes(1);
          expect(dispatchMock).toHaveBeenCalledWith(action);
        });
      });
    });

    describe('when user press heart icon', () => {
      it('dispatches likePost action with flag as `true`', async () => {
        const action = Math.random();
        likePostSpy.mockReturnValueOnce(action as any);
        const { getByTestId } = render(<PostItem {...post} />, options);

        act(() => {
          fireEvent.press(getByTestId('PostItem-Heart'));
        });

        expect(likePostSpy).toHaveBeenCalledTimes(1);
        expect(likePostSpy).toHaveBeenCalledWith({
          id: post.id,
          flag: true,
        });
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(action);
      });

      it('changes heart from outline black to filled red', () => {
        const { getByTestId } = render(<PostItem {...post} />, options);

        const heartIcon = getByTestId('PostItem-Heart');

        expect(heartIcon.props.color).toBe(theme.color.black);
        expect(heartIcon.props.fill).toBe('none');

        act(() => {
          fireEvent.press(heartIcon);
        });

        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);
      });
    });

    describe('when user double-taps post media', () => {
      it('dispatches likePost action', async () => {
        const action = Math.random();
        likePostSpy.mockReturnValueOnce(action as any);
        const { UNSAFE_getByType } = render(<PostItem {...post} />, options);

        act(() => {
          UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(likePostSpy).toHaveBeenCalledTimes(1);
        expect(likePostSpy).toHaveBeenCalledWith({
          id: post.id,
          flag: true,
        });
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(action);
      });

      describe('when double-taps once more', () => {
        it('does not dispatch another likePost action', async () => {
          const { UNSAFE_getByType } = render(<PostItem {...post} />, options);

          act(() => {
            UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
              nativeEvent: { state: State.ACTIVE },
            });
          });

          expect(likePostSpy).toHaveBeenCalledTimes(1);

          act(() => {
            UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
              nativeEvent: { state: State.ACTIVE },
            });
          });

          expect(likePostSpy).toHaveBeenCalledTimes(1);
        });
      });

      it('changes heart from outline black to filled red', () => {
        const { getByTestId, UNSAFE_getByType } = render(
          <PostItem {...post} />,
          options,
        );

        const heartIcon = getByTestId('PostItem-Heart');

        expect(heartIcon.props.color).toBe(theme.color.black);
        expect(heartIcon.props.fill).toBe('none');

        act(() => {
          UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);
      });

      it('renders heart overlay and then hides it', () => {
        setupTimeTravel();
        const { queryByTestId, UNSAFE_getByType } = render(
          <PostItem {...post} />,
          options,
        );

        expect(queryByTestId('PostItem-HeartOverlay')).toBe(null);

        act(() => {
          UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(queryByTestId('PostItem-HeartOverlay')).not.toBe(null);

        act(() => {
          timeTravel(2000);
        });

        expect(queryByTestId('PostItem-HeartOverlay')).toBe(null);
        destroyTimeTravel();
      });
    });
  });

  describe('caption', () => {
    it('renders without caption', () => {
      const { caption, ...rest } = post;
      render(<PostItem {...rest} />, options);
    });

    it('renders all caption when short', () => {
      const caption = faker.lorem.words(2);

      const { getByText } = render(
        <PostItem {...post} caption={caption} />,
        options,
      );

      expect(getByText(RegExp(`${caption}$`))).toBeTruthy();
    });

    describe('when caption is long', () => {
      it('renders clipped caption and expands on "more" click', async () => {
        const caption = faker.lorem.paragraph();

        const { getByText, queryByText, getByTestId } = render(
          <PostItem {...post} caption={caption} />,
          options,
        );

        act(() =>
          getByTestId('post-caption').props.onTextLayout({
            nativeEvent: { lines: { length: 5 } },
          }),
        );

        expect(queryByText(caption)).toBeFalsy();

        const moreText = getByText('more');
        expect(moreText).toBeTruthy();

        fireEvent.press(moreText);

        expect(getByText(RegExp(`${caption}$`))).toBeTruthy();
      });
    });
  });

  describe('comments', () => {
    it('renders without comments', () => {
      const previewComments = { count: 0, comments: [] };
      render(<PostItem {...post} previewComments={previewComments} />, options);
    });

    describe('when there is a single comment', () => {
      it('renders first comment without "see all"', () => {
        const { queryByText } = render(<PostItem {...post} />, options);

        expect(
          queryByText(`${post.previewComments.comments[0].owner.username} `),
        ).toBeTruthy();
        expect(
          queryByText(new RegExp(`${post.previewComments.comments[0].text}$`)),
        ).toBeTruthy();
        expect(queryByText(new RegExp(`^See all`))).toBeFalsy();
      });
    });

    describe('when there are multiple comments', () => {
      it('renders first comment and "see all" text', () => {
        const { queryByText } = render(
          <PostItem {...multiCommentPost} />,
          options,
        );

        expect(
          queryByText(
            `${multiCommentPost.previewComments.comments[0].owner.username} `,
          ),
        ).toBeTruthy();
        expect(
          queryByText(
            new RegExp(`${multiCommentPost.previewComments.comments[0].text}$`),
          ),
        ).toBeTruthy();
        expect(
          queryByText(
            `See all ${multiCommentPost.previewComments.count} comments`,
          ),
        ).toBeTruthy();
      });

      it('navigates to comments screen on "see all" press', () => {
        const navigateSpy = jest.fn();
        useNavigationMock.mockReturnValueOnce({ navigate: navigateSpy });
        const { getByText } = render(
          <PostItem {...multiCommentPost} />,
          options,
        );

        fireEvent.press(
          getByText(
            `See all ${multiCommentPost.previewComments.count} comments`,
          ),
        );

        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith(ROOT_STACK_SCREENS.COMMENTS, {
          post: multiCommentPost,
        });
      });
    });

    describe('when user has liked the first comment', () => {
      const postWithLikedComment = {
        ...post,
        previewComments: {
          ...post.previewComments,
          comments: [
            { ...post.previewComments.comments[0], viewerHasLiked: true },
          ],
        },
      };

      it('renders filled comment heart', () => {
        const { getByTestId } = render(
          <PostItem {...postWithLikedComment} />,
          options,
        );

        const heartIcon = getByTestId('PostItem-CommentHeart');

        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);
      });

      describe('when user press heart icon', () => {
        it('dispatches likeComment action with flag as `false`', async () => {
          const action = Math.random();
          likeCommentSpy.mockReturnValueOnce(action as any);
          const { getByTestId } = render(
            <PostItem {...postWithLikedComment} />,
            options,
          );

          act(() => {
            fireEvent.press(getByTestId('PostItem-CommentHeart'));
          });

          expect(likeCommentSpy).toHaveBeenCalledTimes(1);
          expect(likeCommentSpy).toHaveBeenCalledWith({
            id: post.previewComments.comments[0].id,
            flag: false,
          });
          expect(dispatchMock).toHaveBeenCalledTimes(1);
          expect(dispatchMock).toHaveBeenCalledWith(action);
        });
      });
    });

    describe('when user likes the first comment', () => {
      it('dispatches likeComment action with flag as `true`', async () => {
        const action = Math.random();
        likeCommentSpy.mockReturnValueOnce(action as any);
        const { getByTestId } = render(<PostItem {...post} />, options);

        act(() => {
          fireEvent.press(getByTestId('PostItem-CommentHeart'));
        });

        expect(likeCommentSpy).toHaveBeenCalledTimes(1);
        expect(likeCommentSpy).toHaveBeenCalledWith({
          id: post.previewComments.comments[0].id,
          flag: true,
        });
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(action);
      });

      it('changes heart from outline gray to filled red', () => {
        const { getByTestId } = render(<PostItem {...post} />, options);

        const heartIcon = getByTestId('PostItem-CommentHeart');

        expect(heartIcon.props.color).toBe(theme.color.gray);
        expect(heartIcon.props.fill).toBe('none');

        act(() => {
          fireEvent.press(heartIcon);
        });

        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);
      });
    });
  });

  describe('when post has multiple images', () => {
    const multiImagePost = {
      ...post,
      medias: [...Array(4)].map(generateMockPostMedia),
    };

    it('renders images slider', () => {
      const { getByTestId } = render(<PostItem {...multiImagePost} />, options);

      const slider = getByTestId('PostItem-Slider');

      expect(slider.props).toMatchObject({
        horizontal: true,
        pagingEnabled: true,
      });
      slider.findAllByType(Image).forEach((image, i) => {
        expect(image.props.source.uri).toBe(multiImagePost.medias[i].url);
      });
    });

    it('renders pagination', () => {
      const { getAllByTestId } = render(
        <PostItem {...multiImagePost} />,
        options,
      );

      expect(getAllByTestId('Pagination-Dot')).toHaveLength(
        multiImagePost.medias.length,
      );
    });

    it('renders slider page indicator', () => {
      const { getByText } = render(<PostItem {...multiImagePost} />, options);

      expect(getByText(`1/${multiImagePost.medias.length}`));
    });
  });
});
