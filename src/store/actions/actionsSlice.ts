import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';

export interface Action {
  id: string;
  name: string;
  formFieldName: string;
};
export interface ActionsState extends Record<string, Action> {};

const initialState: ActionsState = {
  'action0': {
    id: 'action0',
    name: 'сформировать предложение',
    formFieldName: 'Предложение',
  },
  'action1': {
    id: 'action1',
    name: 'утвердить',
    formFieldName: 'Подтверждение',
  },
  'action2': {
    id: 'action2',
    name: 'отправить',
    formFieldName: 'Контакты для отправки',
  },
};

export const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {},
});

export const selectActions = (state: RootState) => state.actions;

export default actionsSlice.reducer;
