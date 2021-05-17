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
import { PostItem } from './PostItem';
import { Providers } from '../../Providers';
import { createMockPost } from '../../data/post';
import { HOME_STACK_SCREENS } from '../../navigation/screens';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
const useNavigationMock = useNavigation as jest.Mock;

describe('components - PostItem', () => {
  const post = createMockPost();
  const options: RenderOptions = { wrapper: Providers };

  beforeEach(() => {
    useNavigationMock.mockReset();
  });

  it('renders', () => {
    render(<PostItem {...post} />, options);
  });

  it('matches snapshot', () => {
    const realDateNow = Date.now.bind(global.Date);
    const dateNowMock = jest.fn(() => post.createdAt + 3600 * 1000);
    global.Date.now = dateNowMock;

    const { toJSON } = render(<PostItem {...post} />, options);

    expect(toJSON()).toMatchSnapshot();
    global.Date.now = realDateNow;
  });

  it('renders without location', () => {
    const { location, ...rest } = post;
    render(<PostItem {...rest} />, options);
  });

  describe('likes', () => {
    it('renders without likes', () => {
      const { likedBy, ...rest } = post;
      render(<PostItem {...rest} likedBy={[]} />, options);
    });

    it('renders singular when 1 like', () => {
      const { likedBy, ...rest } = post;
      const { getByText } = render(
        <PostItem {...rest} likedBy={['single']} />,
        options,
      );

      expect(getByText('1 like')).toBeTruthy();
    });

    it('renders plural when > 2 likes', () => {
      const { likedBy, ...rest } = post;
      const { getByText } = render(
        <PostItem {...rest} likedBy={['1', '2']} />,
        options,
      );

      expect(getByText('2 likes')).toBeTruthy();
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
      const { comments, ...rest } = post;
      render(<PostItem {...rest} comments={[]} />, options);
    });

    describe('when there is a single comment', () => {
      it('renders first comment without "see all"', () => {
        const { queryByText } = render(<PostItem {...post} />, options);

        expect(queryByText(`${post.comments[0].owner.username} `)).toBeTruthy();
        expect(
          queryByText(new RegExp(`${post.comments[0].text}$`)),
        ).toBeTruthy();
        expect(queryByText(new RegExp(`^See all`))).toBeFalsy();
      });
    });

    describe('when there are multiple comments', () => {
      const comments = [post.comments[0], post.comments[0]];
      const multiCommentPost = { ...post, comments };

      it('renders first comment and "see all" text', () => {
        const { queryByText } = render(
          <PostItem {...multiCommentPost} />,
          options,
        );

        expect(queryByText(`${post.comments[0].owner.username} `)).toBeTruthy();
        expect(
          queryByText(new RegExp(`${post.comments[0].text}$`)),
        ).toBeTruthy();
        expect(queryByText(`See all ${comments.length} comments`)).toBeTruthy();
      });

      it('navigates to comments screen on "see all" press', () => {
        const navigateSpy = jest.fn();
        useNavigationMock.mockReturnValueOnce({ navigate: navigateSpy });
        const { getByText } = render(
          <PostItem {...multiCommentPost} />,
          options,
        );

        fireEvent.press(getByText(`See all ${comments.length} comments`));

        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith(HOME_STACK_SCREENS.COMMENTS, {
          post: multiCommentPost,
        });
      });
    });
  });
});
