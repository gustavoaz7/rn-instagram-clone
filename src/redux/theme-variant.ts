import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { THEME_VARIANTS } from '../styles/theme';
import { useAppSelector } from './hooks';

const SLICE_NAME = '@@THEME_VARIANT';

export const initialState = THEME_VARIANTS.LIGHT;

export const themeVariantSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    changeVariant: (state, action: PayloadAction<THEME_VARIANTS>) =>
      action.payload,
  },
});

export const themeVariantReducer = themeVariantSlice.reducer;

export const themeVariantActions = themeVariantSlice.actions;

export const useThemeVariantSelector = () =>
  useAppSelector(state => state.themeVariant);
