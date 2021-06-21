import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-root-toast';
import {
  fetchComments,
  TFetchCommentsParams,
  TCommentsResponse,
} from '../services/comments';
import { postLike, TPostLikeBody, TPostLikeResponse } from '../services/likes';
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
  `${SLICE_NAME}/getComments`,
  async ({ postId, ...params }, { rejectWithValue }) => {
    try {
      const comments = await fetchComments(postId, params);
      return comments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const likeComment = createAsyncThunk<
  TPostLikeResponse,
  Omit<TPostLikeBody, 'collection'>
>(
  `${SLICE_NAME}/likePost`,
  // eslint-disable-next-line consistent-return
  async (body, { rejectWithValue }) => {
    try {
      await postLike({ ...body, collection: 'comments' });
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
    builder
      .addCase(likeComment.pending, state => state)
      .addCase(likeComment.rejected, () => {
        Toast.show('Failed to like comment.', {
          position: Toast.positions.CENTER,
        });
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        state.comments = state.comments.map(comment =>
          action.meta.arg.id === comment.id
            ? {
                ...comment,
                viewerHasLiked: action.meta.arg.flag,
                previewLikes: {
                  ...comment.previewLikes,
                  count:
                    comment.previewLikes.count +
                    (action.meta.arg.flag ? 1 : -1),
                },
              }
            : comment,
        );
      });
  },
});
/* eslint-enable no-param-reassign */

export const commentsReducer = commentsSlice.reducer;

export const commentsActions = {
  ...commentsSlice.actions,
  getComments,
  likeComment,
};

export const useCommentsSelector = () =>
  useAppSelector(state => state.comments);
