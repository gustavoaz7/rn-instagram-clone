import React from 'react';
import { act, render } from '@testing-library/react-native';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import { FlatList } from 'react-native';
import faker from 'faker';
import { ProfileScreen, POSTS_LIMIT } from './ProfileScreen';
import { Providers } from '../../Providers';
import { generateMockPost, generateMockProfile } from '../../data';
import { FakeNavigator } from '../../test/fake-navigator';
import { defaultTheme } from '../../test/default-theme';
import { fetchUserPosts } from '../../services/posts';
import { fetchProfile } from '../../services/user';
import { makeFail, makeSuccess } from '../../utils/remote-data';
import { flushPromises } from '../../test/flush-promises';

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useRoute: jest.fn(actual.useRoute),
  };
});
jest.mock('../../services/posts');
const fetchUserPostsMock = fetchUserPosts as jest.MockedFunction<
  typeof fetchUserPosts
>;
jest.mock('../../services/user');
const fetchProfileMock = fetchProfile as jest.MockedFunction<
  typeof fetchProfile
>;

describe('screens - ProfileScreen', () => {
  const options = { wrapper: Providers };
  const useRouteSpy = useRoute as jest.Mock;
  const toastSpy = jest.spyOn(Toast, 'show');
  let username = '';

  beforeEach(() => {
    username = faker.internet.userName();
    useRouteSpy.mockReturnValue({ params: { username } });
    fetchProfileMock.mockResolvedValueOnce(makeSuccess(generateMockProfile()));
    fetchUserPostsMock.mockResolvedValueOnce(
      makeSuccess({ posts: [], canFetchMorePosts: false }),
    );
  });

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

  afterAll(() => {
    toastSpy.mockRestore();
  });

  it('renders', async () => {
    render(<FakeNavigator component={ProfileScreen} />, options);
    await act(async () => {
      await flushPromises();
    });
  });

  it('calls fetchProfile service', async () => {
    render(<FakeNavigator component={ProfileScreen} />, options);
    await act(async () => {
      await flushPromises();
    });

    expect(fetchProfileMock).toHaveBeenCalledTimes(1);
    expect(fetchProfileMock).toHaveBeenCalledWith(username);
  });

  it('calls fetchUserPosts service', async () => {
    render(<FakeNavigator component={ProfileScreen} />, options);
    await act(async () => {
      await flushPromises();
    });

    expect(fetchUserPostsMock).toHaveBeenCalledTimes(1);
    expect(fetchUserPostsMock).toHaveBeenCalledWith(username, {
      offset: 0,
      limit: POSTS_LIMIT,
    });
  });

  it('renders loading', () => {
    const { queryByTestId } = render(
      <FakeNavigator component={ProfileScreen} />,
      options,
    );

    expect(queryByTestId('Loading-Profile')).toBeTruthy();
    expect(queryByTestId('ProfileHeader')).toBeFalsy();
    expect(queryByTestId('GalleryGrid')).toBeFalsy();
  });

  describe('when profile request succeeds', () => {
    describe('when posts request succeeds', () => {
      const posts = [generateMockPost(), generateMockPost()];
      const posts2 = [generateMockPost(), generateMockPost()];

      beforeEach(() => {
        fetchUserPostsMock
          .mockReset()
          .mockResolvedValueOnce(
            makeSuccess({ posts, canFetchMorePosts: true }),
          )
          .mockResolvedValueOnce(
            makeSuccess({ posts: posts2, canFetchMorePosts: true }),
          );
      });

      it('renders gallery grid items', async () => {
        const { queryByTestId, getAllByTestId } = render(
          <FakeNavigator component={ProfileScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        expect(queryByTestId('GalleryGrid')).toBeTruthy();
        expect(getAllByTestId('GalleryGridItem')).toHaveLength(posts.length);
      });

      describe('when reaches the end of list', () => {
        it('calls fetchUserPosts service a second time', async () => {
          const { getByTestId } = render(
            <FakeNavigator component={ProfileScreen} />,
            options,
          );
          await act(async () => {
            await flushPromises();
          });

          await act(async () => {
            getByTestId('GalleryGrid').props.onEndReached();
            await flushPromises();
          });

          expect(fetchUserPosts).toHaveBeenCalledTimes(2);
          expect(fetchUserPosts).toHaveBeenLastCalledWith(username, {
            offset: POSTS_LIMIT,
            limit: POSTS_LIMIT,
          });
        });

        it('does not call fetchUserPosts when alerady loading', async () => {
          const { getByTestId } = render(
            <FakeNavigator component={ProfileScreen} />,
            options,
          );
          await act(async () => {
            await flushPromises();
          });

          act(() => {
            getByTestId('GalleryGrid').props.onEndReached();
          });

          expect(fetchUserPostsMock).toHaveBeenCalledTimes(2);

          await act(async () => {
            getByTestId('GalleryGrid').props.onEndReached();
          });

          expect(fetchUserPostsMock).toHaveBeenCalledTimes(2);
        });

        it('rendes previous gallery items and loading spinner', async () => {
          const { queryByTestId, queryAllByTestId, getByTestId } = render(
            <FakeNavigator component={ProfileScreen} />,
            options,
          );
          await act(async () => {
            await flushPromises();
          });

          act(() => {
            getByTestId('GalleryGrid').props.onEndReached();
          });

          expect(queryAllByTestId('GalleryGridItem')).toHaveLength(
            posts.length,
          );
          expect(queryByTestId('Loading-Posts')).toBeTruthy();
          await act(async () => {
            await flushPromises();
          });
        });

        it('rendes old and new gallery items', async () => {
          const { getByTestId, queryAllByTestId } = render(
            <FakeNavigator component={ProfileScreen} />,
            options,
          );
          await act(async () => {
            await flushPromises();
          });

          await act(async () => {
            getByTestId('GalleryGrid').props.onEndReached();
          });

          expect(queryAllByTestId('GalleryGridItem')).toHaveLength(
            posts.length + posts2.length,
          );
        });

        describe('and there are no more posts to fetch', () => {
          beforeEach(() => {
            fetchUserPostsMock
              .mockReset()
              .mockResolvedValueOnce(
                makeSuccess({ posts, canFetchMorePosts: false }),
              );
          });

          it('does not request for more posts', async () => {
            const { getByTestId } = render(
              <FakeNavigator component={ProfileScreen} />,
              options,
            );
            await act(async () => {
              await flushPromises();
            });

            await act(async () => {
              getByTestId('GalleryGrid').props.onEndReached();
            });

            expect(fetchUserPostsMock).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe('on pull to refresh', () => {
        // Investigate on console.error
        beforeAll(() => {
          jest.spyOn(console, 'error').mockImplementation(() => null);
        });

        afterAll(() => {
          // eslint-disable-next-line no-console
          (console.error as jest.Mock).mockRestore();
        });

        it('calls fetchProfile and fetchUserPosts service a second time', async () => {
          const { UNSAFE_getByType } = render(
            <FakeNavigator component={ProfileScreen} />,
            options,
          );
          await act(async () => {
            await flushPromises();
          });

          await act(async () => {
            UNSAFE_getByType(FlatList).props.refreshControl.props.onRefresh();
          });

          expect(fetchProfileMock).toHaveBeenCalledTimes(2);
          expect(fetchProfileMock).toHaveBeenNthCalledWith(2, username);
          expect(fetchUserPostsMock).toHaveBeenCalledTimes(2);
          expect(fetchUserPostsMock).toHaveBeenLastCalledWith(username, {
            offset: 0,
            limit: POSTS_LIMIT,
          });
        });

        it('removes previous components and renders only loading', async () => {
          const { UNSAFE_getByType, queryByTestId } = render(
            <FakeNavigator component={ProfileScreen} />,
            options,
          );
          await act(async () => {
            await flushPromises();
          });

          act(() => {
            UNSAFE_getByType(FlatList).props.refreshControl.props.onRefresh();
          });

          expect(queryByTestId('ProfileHeader')).toBeFalsy();
          expect(queryByTestId('GalleryGrid')).toBeFalsy();
          expect(queryByTestId('GalleryGridItem')).toBeFalsy();
          expect(queryByTestId('Loading-Profile')).toBeTruthy();
        });

        it('has gray color', async () => {
          const { UNSAFE_getByType } = render(
            <FakeNavigator component={ProfileScreen} />,
            options,
          );
          await act(async () => {
            await flushPromises();
          });
          const { refreshControl } = UNSAFE_getByType(FlatList).props;

          expect(refreshControl.props.tintColor).toBe(defaultTheme.color.gray);
          expect(refreshControl.props.colors).toEqual([
            defaultTheme.color.gray,
          ]);
        });
      });
    });

    describe('when posts request fails', () => {
      beforeEach(() => {
        fetchUserPostsMock
          .mockReset()
          .mockResolvedValueOnce(makeFail(new Error('')));
      });

      it('shows toast', async () => {
        render(<FakeNavigator component={ProfileScreen} />, options);
        await act(async () => {
          await flushPromises();
        });

        expect(toastSpy).toHaveBeenCalledTimes(1);
        expect(toastSpy).toHaveBeenCalledWith('Failed fetching posts.', {
          position: Toast.positions.CENTER,
        });
      });
    });
  });

  describe('when profile request fails', () => {
    const error = new Error(faker.random.words(3));

    beforeEach(() => {
      fetchProfileMock.mockReset();
      fetchProfileMock.mockResolvedValueOnce(makeFail(error));
    });

    it('shows toast', async () => {
      render(<FakeNavigator component={ProfileScreen} />, options);
      await act(async () => {
        await flushPromises();
      });

      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith('Failed fetching profile.', {
        position: Toast.positions.CENTER,
      });
    });
  });
});
