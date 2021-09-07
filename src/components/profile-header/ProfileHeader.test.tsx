import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfileHeader, TProfileHeaderProps } from './ProfileHeader';
import { Providers } from '../../Providers';
import { generateMockProfile } from '../../data';
import { ROOT_STACK_SCREENS } from '../../navigation/screens';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
const useNavigationMock = useNavigation as jest.Mock;

describe('components - ProfileHeader', () => {
  const navigateSpy = jest.fn();
  useNavigationMock.mockReturnValue({ navigate: navigateSpy });
  const props: TProfileHeaderProps = generateMockProfile();
  const options = { wrapper: Providers };

  beforeEach(() => {
    navigateSpy.mockReset();
  });

  it('renders', () => {
    render(<ProfileHeader {...props} />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<ProfileHeader {...props} />, options);

    expect(toJSON()).toMatchSnapshot();
  });

  it('inherits style', () => {
    const style = { backgroundColor: 'orange' };
    const { getByTestId } = render(
      <ProfileHeader {...props} style={style} />,
      options,
    );

    expect(getByTestId('ProfileHeader')).toHaveStyle(style);
  });

  it('renders correct profile stats', () => {
    const { queryByText } = render(<ProfileHeader {...props} />, options);

    expect(queryByText(`${props.postsCount}`)).toBeTruthy();
    expect(queryByText(`${props.followedByCount}`)).toBeTruthy();
    expect(queryByText(`${props.followedByCount}`)).toBeTruthy();
  });

  describe('when profile has story', () => {
    it('renders gradient avatar ring', () => {
      const { UNSAFE_getByType } = render(
        <ProfileHeader {...props} />,
        options,
      );

      expect(
        UNSAFE_getByType(Pressable).findByProps({ color: 'gradient' }),
      ).toBeTruthy();
    });

    describe('when avatar is pressed', () => {
      it('prefetches story medias ', async () => {
        const spy = jest.spyOn(Image, 'prefetch');
        const { UNSAFE_getByType } = render(
          <ProfileHeader {...props} />,
          options,
        );

        await act(async () => {
          fireEvent.press(UNSAFE_getByType(Pressable));
        });

        if (!props.story) fail();
        expect(spy).toHaveBeenCalledTimes(props.story.medias.length);
        props.story.medias.forEach((media, i) => {
          expect(spy).toHaveBeenNthCalledWith(i + 1, media.url);
        });
        spy.mockRestore();
      });

      it('navigates to story screen on press', async () => {
        const { UNSAFE_getByType } = render(
          <ProfileHeader {...props} />,
          options,
        );

        await act(async () => {
          fireEvent.press(UNSAFE_getByType(Pressable));
        });

        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith(ROOT_STACK_SCREENS.STORY, {
          id: props.story?.id,
          story: props.story,
        });
      });
    });
  });

  describe('when profile has no story', () => {
    const noStoryProps: TProfileHeaderProps = { ...props, story: undefined };

    it('renders transparent avatar ring', () => {
      const { UNSAFE_getByType } = render(
        <ProfileHeader {...noStoryProps} />,
        options,
      );

      expect(
        UNSAFE_getByType(Pressable).findByProps({ color: 'transparent' }),
      ).toBeTruthy();
    });

    describe('when avatar is pressed', () => {
      it('does not prefetches any image ', async () => {
        const spy = jest.spyOn(Image, 'prefetch');
        const { UNSAFE_getByType } = render(
          <ProfileHeader {...noStoryProps} />,
          options,
        );

        await act(async () => {
          fireEvent.press(UNSAFE_getByType(Pressable));
        });

        expect(spy).toHaveBeenCalledTimes(0);
        spy.mockRestore();
      });

      it('does not navigates to story screen on press', async () => {
        const { UNSAFE_getByType } = render(
          <ProfileHeader {...noStoryProps} />,
          options,
        );

        await act(async () => {
          fireEvent.press(UNSAFE_getByType(Pressable));
        });

        expect(navigateSpy).toHaveBeenCalledTimes(0);
      });
    });
  });
});
