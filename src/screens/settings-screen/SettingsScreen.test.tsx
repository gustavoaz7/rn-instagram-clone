import React from 'react';
import { render } from '@testing-library/react-native';
import { Providers } from '../../Providers';
import { FakeNavigator } from '../../test/fake-navigator';
import { SettingsScreen } from './SettingsScreen';

describe('screens - SettingsScreen', () => {
  const options = { wrapper: Providers };

  it('renders', () => {
    render(<FakeNavigator component={SettingsScreen} />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <FakeNavigator component={SettingsScreen} />,
      options,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
