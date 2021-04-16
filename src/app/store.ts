import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import rolesReducer from '../features/roles/rolesSlice';
import actionsReducer from '../features/actions/actionsSlice';
import roleActionMapReducer from '../features/roleActionMap/roleActionMapSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    roles: rolesReducer,
    actions: actionsReducer,
    roleActionMap: roleActionMapReducer,
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
