import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';

export interface Action {
  id: string;
  name: string;
};
export interface ActionsState extends Record<string, Action> {};

const initialState: ActionsState = {
  'action0': {
    id: 'action0',
    name: 'сформировать предложение',
  },
  'action1': {
    id: 'action1',
    name: 'утвердить',
  },
  'action2': {
    id: 'action2',
    name: 'отправить',
  },
};

export const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {},
});

export const selectActions = (state: RootState) => state.actions;

export default actionsSlice.reducer;
