import React from 'react';
import { render } from '@testing-library/react-native';
import { createMockPost } from '../../data/post';
import { Comment } from './Comment';
import { Providers } from '../../Providers';

describe('components - Comment', () => {
  const options = { wrapper: Providers };
  const comment = createMockPost().comments[0];

  it('renders', () => {
    render(<Comment {...comment} />, options);
  });

  it('matches snapshot', () => {
    const realDateNow = Date.now.bind(global.Date);
    const dateNowMock = jest.fn(() => comment.createdAt + 3600 * 1000);
    global.Date.now = dateNowMock;

    const { toJSON } = render(<Comment {...comment} />, options);

    expect(toJSON()).toMatchSnapshot();
    global.Date.now = realDateNow;
  });

  describe('likes', () => {
    it('renders without likes', () => {
      render(<Comment {...comment} likedBy={[]} />, options);
    });

    it('renders singular when 1 like', () => {
      const { getByText } = render(
        <Comment {...comment} likedBy={['single']} />,
        options,
      );

      expect(getByText('1 like')).toBeTruthy();
    });

    it('renders plural when > 2 likes', () => {
      const { getByText } = render(
        <Comment {...comment} likedBy={['1', '2']} />,
        options,
      );

      expect(getByText('2 likes')).toBeTruthy();
    });
  });
});
