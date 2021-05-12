import { useDispatch, createSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector = createSelectorHook<RootState>();
