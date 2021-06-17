import React from 'react';
import {
  render,
  RenderOptions,
  fireEvent,
} from '@testing-library/react-native';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StoryPreviewItem, SCALE_DURATION } from './StoryPreviewItem';
import { Providers } from '../../Providers';
import {
  setupTimeTravel,
  destroyTimeTravel,
  timeTravel,
} from '../../test/time-travel';
import { generateMockOwner } from '../../data';
import { ROOT_STACK_SCREENS } from '../../navigation/screens';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
const useNavigationMock = useNavigation as jest.Mock;

describe('components - StoryPreviewItem', () => {
  const owner = generateMockOwner();
  const options: RenderOptions = { wrapper: Providers };
  const navigateSpy = jest.fn();
  useNavigationMock.mockReturnValue({ navigate: navigateSpy });

  beforeEach(() => {
    setupTimeTravel();
    navigateSpy.mockReset();
  });

  afterEach(() => {
    destroyTimeTravel();
  });

  it('renders', () => {
    render(<StoryPreviewItem owner={owner} />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<StoryPreviewItem owner={owner} />, options);

    expect(toJSON()).toMatchSnapshot();
  });

  it('bounces on press', () => {
    const { UNSAFE_getByType } = render(
      <StoryPreviewItem owner={owner} />,
      options,
    );

    const element = UNSAFE_getByType(Animated.View);
    const animatedScale = element.props.style.transform[0].scale;

    fireEvent(element, 'pressIn');
    timeTravel(SCALE_DURATION);

    expect(animatedScale).toMatchInlineSnapshot('0.9');

    fireEvent(element, 'pressOut');
    timeTravel(SCALE_DURATION);

    expect(animatedScale).toMatchInlineSnapshot('1');
  });

  it('navigates to story screen on press', () => {
    const { getByTestId } = render(<StoryPreviewItem owner={owner} />, options);

    fireEvent.press(getByTestId('StoryPreviewItem'));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(ROOT_STACK_SCREENS.STORY, {
      username: owner.username,
    });
  });
});
