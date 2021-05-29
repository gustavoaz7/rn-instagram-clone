import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPosts, TFetchPostsParams, TPostsResponse } from '../api';
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
  SLICE_NAME,
  async (params, { rejectWithValue }) => {
    try {
      const posts = await fetchPosts(params);
      return posts;
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
  },
});
/* eslint-enable no-param-reassign */

export const postsReducer = postsSlice.reducer;

export const postsActions = { ...postsSlice.actions, getPosts };

export const usePostsSelector = () => useAppSelector(state => state.posts);
