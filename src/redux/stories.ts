import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchStories, TStoriesResponse } from '../services/stories';
import { TStory } from '../types';
import { isFail } from '../utils/remote-data';
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

const getStories = createAsyncThunk<
  TStoriesResponse,
  void,
  { rejectValue: string }
>(SLICE_NAME, async (_, { rejectWithValue }) => {
  const stories = await fetchStories();

  return isFail(stories)
    ? rejectWithValue(stories.error.message)
    : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      stories.data!;
});

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
        state.error = action.payload || null;
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
