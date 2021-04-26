import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState, AppThunk } from '../store';
import { getId } from '../../utils';
import {
  removeBPRelation,
  selectBPRelations,
}  from '../bpRelations/bpRelationsSlice';
import {
  DocumentWithMessages,
} from '../configs/configsSlice';

export interface RoleActionRelation {
  id: string;
  roleId: string;
  actionId: string;
  documents: Array<DocumentWithMessages>;
};
export interface RoleActionMapState extends Record<string, RoleActionRelation> {};

export const createNewRelation = (roleId: string, actionId: string): RoleActionRelation => {
  return {
    id: getId('roleActionRelation'),
    roleId,
    actionId,
    documents: [],
  };
};

const initialState: RoleActionMapState = {};

export const roleActionMapSlice = createSlice({
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

export const {
  addRelation,
  removeRelation,
  changeRelation,
} = roleActionMapSlice.actions;
export const selectRoleActionMap = (state: RootState) => state.roleActionMap;

export const removeRoleActionRelation = (roleActionId: string): AppThunk => (
  dispatch,
  getState,
) => {
  const bpRelations = selectBPRelations(getState());
  const bpRelationsValues = Object.values(bpRelations);
  bpRelationsValues.forEach(({ id, relation }) => {
    if (relation.includes(roleActionId)) {
      dispatch(removeBPRelation(id));
    }
  });
  dispatch(removeRelation(roleActionId));
};

export default roleActionMapSlice.reducer;
