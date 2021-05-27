import React from 'react';
import { render } from '@testing-library/react-native';
import { generateMockComment } from '../../data';
import { Comment } from './Comment';
import { Providers } from '../../Providers';

describe('components - Comment', () => {
  const options = { wrapper: Providers };
  const comment = generateMockComment(3);

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

  it('inherits style', () => {
    const style = { backgroundColor: 'orange' };
    const { getByTestId } = render(
      <Comment {...comment} style={style} />,
      options,
    );

    expect(getByTestId('Comment')).toHaveStyle(style);
  });

  describe('likes', () => {
    it('renders without likes', () => {
      render(<Comment {...generateMockComment(0)} />, options);
    });

    it('renders singular when 1 like', () => {
      const { getByText } = render(
        <Comment {...generateMockComment(1)} />,
        options,
      );

      expect(getByText('1 like')).toBeTruthy();
    });

    it('renders plural when > 2 likes', () => {
      const { getByText } = render(
        <Comment {...generateMockComment(2)} />,
        options,
      );

      expect(getByText('2 likes')).toBeTruthy();
    });
  });

  describe('when not interactable', () => {
    it('matches snapshot', () => {
      const realDateNow = Date.now.bind(global.Date);
      const dateNowMock = jest.fn(() => comment.createdAt + 3600 * 1000);
      global.Date.now = dateNowMock;

      const { toJSON } = render(
        <Comment {...comment} interactable={false} />,
        options,
      );

      expect(toJSON()).toMatchSnapshot();
      global.Date.now = realDateNow;
    });
  });
});
