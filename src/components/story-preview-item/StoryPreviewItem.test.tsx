import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { StoryPreviewItem } from './StoryPreviewItem';
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
});
