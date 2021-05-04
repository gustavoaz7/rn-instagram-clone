import React from 'react';
import {
  render,
  RenderOptions,
  fireEvent,
} from '@testing-library/react-native';
import { StoryPreviewItem, SCALE_DURATION } from './StoryPreviewItem';
import { Providers } from '../../Providers';

describe('components - StoryPreviewItem', () => {
  const options: RenderOptions = { wrapper: Providers };

  it('renders', () => {
    render(<StoryPreviewItem />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<StoryPreviewItem />, options);

    expect(toJSON()).toMatchSnapshot();
  });

  it('bounces on press', () => {
    jest.useFakeTimers();
    const { getByText, toJSON } = render(<StoryPreviewItem />, options);

    fireEvent(getByText('veryLongNameHere'), 'pressIn');
    jest.advanceTimersByTime(SCALE_DURATION);

    expect(toJSON()).toMatchSnapshot('scaled down');

    fireEvent(getByText('veryLongNameHere'), 'pressOut');
    jest.advanceTimersByTime(SCALE_DURATION);

    expect(toJSON()).toMatchSnapshot('back to initial scale');
  });
});
