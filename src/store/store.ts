import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import counterReducer from './counter/counterSlice';
import rolesReducer from './roles/rolesSlice';
import actionsReducer from './actions/actionsSlice';
import roleActionMapReducer from './roleActionMap/roleActionMapSlice';
import bpRelationsReducer from './bpRelations/bpRelationsSlice';
import configsReducer from './configs/configsSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    roles: rolesReducer,
    actions: actionsReducer,
    roleActionMap: roleActionMapReducer,
    bpRelations: bpRelationsReducer,
    configs: configsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
