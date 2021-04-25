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

// export const incrementAsync = createAsyncThunk(
//   'counter/fetchCount',
//   async (amount: number) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

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
    // increment: (state) => {
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(incrementAsync.pending, (state) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(incrementAsync.fulfilled, (state, action) => {
  //       state.status = 'idle';
  //       state.value += action.payload;
  //     });
  // },
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
