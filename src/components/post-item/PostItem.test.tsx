/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  render,
  RenderOptions,
  fireEvent,
  act,
} from '@testing-library/react-native';
import faker from 'faker';
import { PostItem } from './PostItem';
import { Providers } from '../../Providers';
import { createMockPost } from '../../data/post';

describe('components - PostItem', () => {
  const post = createMockPost();

  const options: RenderOptions = { wrapper: Providers };

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
});
