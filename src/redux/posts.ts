import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPosts } from '../api';
import { TPost } from '../types';
import { useAppSelector } from './hooks';

const SLICE_NAME = '@@POSTS';

export type TPostsState = Readonly<{
  posts: TPost[];
  loading: boolean;
  error: string | null;
}>;

export const initialState: TPostsState = {
  posts: [],
  loading: false,
  error: null,
};

const getPosts = createAsyncThunk(
  SLICE_NAME,
  async (_, { rejectWithValue }) => {
    try {
      const posts = await fetchPosts();
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
        state.posts = action.payload;
      });
  },
});
/* eslint-enable no-param-reassign */

export const postsReducer = postsSlice.reducer;

export const postsActions = { ...postsSlice.actions, getPosts };

export const usePostsSelector = () => useAppSelector(state => state.posts);
