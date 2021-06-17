import React from 'react';
import {
  render,
  RenderOptions,
  fireEvent,
  act,
} from '@testing-library/react-native';
import { Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StoryPreviewItem, SCALE_DURATION } from './StoryPreviewItem';
import { Providers } from '../../Providers';
import {
  setupTimeTravel,
  destroyTimeTravel,
  timeTravel,
} from '../../test/time-travel';
import { generateMockStory } from '../../data';
import { ROOT_STACK_SCREENS } from '../../navigation/screens';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
const useNavigationMock = useNavigation as jest.Mock;

describe('components - StoryPreviewItem', () => {
  const story = generateMockStory();
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
    render(<StoryPreviewItem story={story} />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<StoryPreviewItem story={story} />, options);

    expect(toJSON()).toMatchSnapshot();
  });

  it('bounces on press', () => {
    const { UNSAFE_getByType } = render(
      <StoryPreviewItem story={story} />,
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

  describe('when pressed', () => {
    it('prefetches story medias ', async () => {
      const spy = jest.spyOn(Image, 'prefetch');
      const { getByTestId } = render(
        <StoryPreviewItem story={story} />,
        options,
      );

      await act(async () => {
        fireEvent.press(getByTestId('StoryPreviewItem'));
      });

      expect(spy).toHaveBeenCalledTimes(story.medias.length);
      story.medias.forEach((media, i) => {
        expect(spy).toHaveBeenNthCalledWith(i + 1, media.url);
      });
      spy.mockRestore();
    });

    it('navigates to story screen on press', async () => {
      const { getByTestId } = render(
        <StoryPreviewItem story={story} />,
        options,
      );

      await act(async () => {
        fireEvent.press(getByTestId('StoryPreviewItem'));
      });

      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith(ROOT_STACK_SCREENS.STORY, {
        id: story.id,
      });
    });
  });
});
