import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getId } from '../../utils';

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
    removeRole: (state, action: PayloadAction<string>) => {
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

export const { addRole, removeRole } = rolesSlice.actions;
export const selectRoles = (state: RootState) => state.roles;
// export const incrementIfOdd = (amount: number): AppThunk => (
//   dispatch,
//   getState
// ) => {
//   const currentValue = selectCount(getState());
//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));
//   }
// };

export default rolesSlice.reducer;
