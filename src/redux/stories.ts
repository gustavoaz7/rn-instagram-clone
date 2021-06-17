import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchStories } from '../api';
import { TStory } from '../types';
import { useAppSelector } from './hooks';

const SLICE_NAME = '@@STORIES';

export type TStoriesState = Readonly<{
  stories: TStory[];
  loading: boolean;
  error: string | null;
}>;

export const initialState: TStoriesState = {
  stories: [],
  loading: false,
  error: null,
};

const getStories = createAsyncThunk(
  SLICE_NAME,
  async (_, { rejectWithValue }) => {
    try {
      const stories = await fetchStories();
      return stories;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/* eslint-disable no-param-reassign */
export const storiesSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getStories.pending, state => {
        state.loading = true;
      })
      .addCase(getStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getStories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.stories = action.payload;
      });
  },
});
/* eslint-enable no-param-reassign */

export const storiesReducer = storiesSlice.reducer;

export const storiesActions = { ...storiesSlice.actions, getStories };

export const useStoriesSelector = () => useAppSelector(state => state.stories);
