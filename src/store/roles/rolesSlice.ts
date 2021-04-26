import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState, AppThunk } from '../store';
import { getId } from '../../utils';
import { removeBPRelation, selectBPRelations } from '../bpRelations/bpRelationsSlice';
import { selectRoleActionMap } from '../roleActionMap/roleActionMapSlice';

export interface Role {
  id: string;
  name: string;
};
export interface RolesState extends Record<string, Role> {};

export const createNewRole = (name: string) => {
  return {
    id: getId('role'),
    name,
  };
};

const initialState: RolesState = {
  'role0': {
    id: 'role0',
    name: 'менеджер',
  },
  'role1': {
    id: 'role1',
    name: 'сотрудник',
  },
};

export const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    addRole: (state, action: PayloadAction<string>) => {
      const role = createNewRole(action.payload);
      state[role.id] = role;
    },
    remove: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const { addRole, remove } = rolesSlice.actions;
export const selectRoles = (state: RootState) => state.roles;

export const removeRole = (roleId: string): AppThunk => (
  dispatch,
  getState,
) => {
  const roleActionMap = selectRoleActionMap(getState());

  const bpRelations = selectBPRelations(getState());
  const bpRelationsValues = Object.values(bpRelations);
  bpRelationsValues.forEach(({ id, relation }) => {
    relation.forEach((roleActionRelationId) => {
      const roleAction = roleActionMap[roleActionRelationId];
      if (roleId === roleAction.roleId) {
        dispatch(removeBPRelation(id));
      }
    });
  });
  dispatch(remove(roleId));
};

export default rolesSlice.reducer;
