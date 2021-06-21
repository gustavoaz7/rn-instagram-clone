import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-root-toast';
import { postLike, TPostLikeBody, TPostLikeResponse } from '../services/likes';
import {
  fetchPosts,
  TFetchPostsParams,
  TPostsResponse,
} from '../services/posts';
import { TPost } from '../types';
import { useAppSelector } from './hooks';

const SLICE_NAME = '@@POSTS';

export type TPostsState = Readonly<{
  posts: TPost[];
  canFetchMorePosts: boolean;
  loading: boolean;
  error: string | null;
}>;

export const initialState: TPostsState = {
  posts: [],
  canFetchMorePosts: true,
  loading: false,
  error: null,
};

const getPosts = createAsyncThunk<TPostsResponse, TFetchPostsParams>(
  `${SLICE_NAME}/getPosts`,
  async (params, { rejectWithValue }) => {
    try {
      const posts = await fetchPosts(params);
      return posts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const likePost = createAsyncThunk<
  TPostLikeResponse,
  Omit<TPostLikeBody, 'collection'>
>(
  `${SLICE_NAME}/likePost`,
  // eslint-disable-next-line consistent-return
  async (body, { rejectWithValue }) => {
    try {
      await postLike({ ...body, collection: 'posts' });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/* eslint-disable no-param-reassign */
export const postsSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getPosts.pending, state => {
        state.loading = true;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.canFetchMorePosts = action.payload.canFetchMorePosts;
        const isRefresh = action.meta.arg.refresh;
        state.posts = isRefresh
          ? action.payload.posts
          : [...state.posts, ...action.payload.posts];
      });
    builder
      .addCase(likePost.pending, state => state)
      .addCase(likePost.rejected, () => {
        Toast.show('Failed to like post.', {
          position: Toast.positions.CENTER,
        });
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.posts = state.posts.map(post =>
          action.meta.arg.id === post.id
            ? {
                ...post,
                viewerHasLiked: action.meta.arg.flag,
                previewLikes: {
                  ...post.previewLikes,
                  count:
                    post.previewLikes.count + (action.meta.arg.flag ? 1 : -1),
                },
              }
            : post,
        );
      });
  },
});
/* eslint-enable no-param-reassign */

export const postsReducer = postsSlice.reducer;

export const postsActions = { ...postsSlice.actions, getPosts, likePost };

export const usePostsSelector = () => useAppSelector(state => state.posts);
