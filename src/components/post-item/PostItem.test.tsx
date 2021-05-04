import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { PostItem } from './PostItem';
import { Providers } from '../../Providers';

describe('components - PostItem', () => {
  const options: RenderOptions = { wrapper: Providers };

  it('renders', () => {
    render(<PostItem />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<PostItem />, options);

    expect(toJSON()).toMatchSnapshot();
  });
});
