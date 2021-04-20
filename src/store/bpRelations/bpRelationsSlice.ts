import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { getId } from '../../utils';

export interface BPRelation {
  id: string;
  relation: Array<string>;
};
export interface BPRelationsState extends Record<string, BPRelation> {};

export const createNewRelation = (relation: Array<string>): BPRelation => {
  return {
    id: getId('bpRelation'),
    relation,
  };
};

const initialState: BPRelationsState = {};

export const bpRelationsSlice = createSlice({
  name: 'bpRelations',
  initialState,
  reducers: {
    addBPRelation: (state, action: PayloadAction<Array<string>>) => {
      const bpRelation = createNewRelation(action.payload);
      state[bpRelation.id] = bpRelation;
    },
    removeBPRelation: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    changeBPRelation: (state, action: PayloadAction<{
      id: string;
      from?: string;
      to?: string;
    }>) => {
      const { id, from, to } = action.payload;
      const [oldFrom, oldTo] = state[id].relation;
      if (from) state[id].relation = [from, oldTo];
      if (to) state[id].relation = [oldFrom, to];
    },
  },
});

export const { addBPRelation, removeBPRelation, changeBPRelation } = bpRelationsSlice.actions;
export const selectBPRelations = (state: RootState) => state.bpRelations;

export default bpRelationsSlice.reducer;
