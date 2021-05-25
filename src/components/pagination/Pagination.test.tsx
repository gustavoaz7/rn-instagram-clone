import React from 'react';
import { render } from '@testing-library/react-native';
import { Pagination } from './Pagination';
import { Providers } from '../../Providers';

describe('components - Pagination', () => {
  const options = { wrapper: Providers };
  const props = { total: 4, current: 1 };

  it('renders', () => {
    render(<Pagination {...props} />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<Pagination {...props} />, options);

    expect(toJSON()).toMatchSnapshot();
  });
});
