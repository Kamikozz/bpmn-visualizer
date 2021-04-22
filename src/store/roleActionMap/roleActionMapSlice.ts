import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { getId } from '../../utils';

export interface RoleActionRelation {
  id: string;
  roleId: string;
  actionId: string;
};
export interface RoleActionMapState extends Record<string, RoleActionRelation> {};

export const createNewRelation = (roleId: string, actionId: string): RoleActionRelation => {
  return {
    id: getId('roleActionRelation'),
    roleId,
    actionId,
  };
};

const initialState: RoleActionMapState = {};

export const actionsSlice = createSlice({
  name: 'roleActionMap',
  initialState,
  reducers: {
    addRelation: (state, action: PayloadAction<{ roleId: string; actionId: string; }>) => {
      const { roleId, actionId } = action.payload;
      const relation = createNewRelation(roleId, actionId);
      state[relation.id] = relation;
    },
    removeRelation: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    changeRelation: (state, action: PayloadAction<{
      id: string;
      roleId?: string;
      actionId?: string;
    }>) => {
      const { id, roleId, actionId } = action.payload;
      const relation = state[id];
      if (roleId) relation.roleId = roleId;
      if (actionId) relation.actionId = actionId;
    },
  },
});

export const { addRelation, removeRelation, changeRelation } = actionsSlice.actions;
export const selectRoleActionMap = (state: RootState) => state.roleActionMap;

export default actionsSlice.reducer;
