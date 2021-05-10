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
    name: 'отправить предложение',
    formFieldName: 'Контакты для отправки',
  },
  'action3': {
    id: 'action3',
    name: 'составить документ',
    formFieldName: 'Документ',
  },
  'action4': {
    id: 'action4',
    name: 'проверить на соответствие фин. требований',
    formFieldName: 'соблюдение фин.требований',
  },
  'action5': {
    id: 'action5',
    name: 'проверить на соответствие законодательству',
    formFieldName: 'соблюдение законодательства',
  },
  'action6': {
    id: 'action6',
    name: 'Регистрация договора',
    formFieldName: 'Зарегистрировать',
  },
};

export const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {},
});

export const selectActions = (state: RootState) => state.actions;

export default actionsSlice.reducer;
