import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchComments, TFetchCommentsParams, TCommentsResponse } from '../api';
import { TComment } from '../types';
import { useAppSelector } from './hooks';

const SLICE_NAME = '@@COMMENTS';

export type TCommentsState = Readonly<{
  comments: TComment[];
  canFetchMoreComments: boolean;
  loading: boolean;
  error: string | null;
}>;

export const initialState: TCommentsState = {
  comments: [],
  canFetchMoreComments: true,
  loading: false,
  error: null,
};

export type TGetCommentsThunkArg = TFetchCommentsParams & { postId: string };
const getComments = createAsyncThunk<TCommentsResponse, TGetCommentsThunkArg>(
  SLICE_NAME,
  async ({ postId, ...params }, { rejectWithValue }) => {
    try {
      const comments = await fetchComments(postId, params);
      return comments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/* eslint-disable no-param-reassign */
export const commentsSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    clearComments: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(getComments.pending, state => {
        state.loading = true;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.canFetchMoreComments = action.payload.canFetchMoreComments;
        const isRefresh = action.meta.arg.refresh;
        state.comments = isRefresh
          ? action.payload.comments
          : [...state.comments, ...action.payload.comments];
      });
  },
});
/* eslint-enable no-param-reassign */

export const commentsReducer = commentsSlice.reducer;

export const commentsActions = { ...commentsSlice.actions, getComments };

export const useCommentsSelector = () =>
  useAppSelector(state => state.comments);
