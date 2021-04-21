import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getId } from '../../utils';

export interface BPRelation {
  id: string;
  relation: Array<string>;
};
export interface BPRelations extends Record<string, BPRelation> {};
export interface BPRelationsState {
  items: BPRelations;
  startNode: string | null;
};

export const createNewRelation = (relation: Array<string>): BPRelation => {
  return {
    id: getId('bpRelation'),
    relation,
  };
};

const initialState: BPRelationsState = {
  items: {},
  startNode: null,
};

export const bpRelationsSlice = createSlice({
  name: 'bpRelations',
  initialState,
  reducers: {
    addBPRelation: (state, action: PayloadAction<Array<string>>) => {
      const bpRelation = createNewRelation(action.payload);
      state.items[bpRelation.id] = bpRelation;
    },
    removeBPRelation: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    changeBPRelation: (state, action: PayloadAction<{
      id: string;
      from?: string;
      to?: string;
    }>) => {
      const { id, from, to } = action.payload;
      const [oldFrom, oldTo] = state.items[id].relation;
      if (from) state.items[id].relation = [from, oldTo];
      if (to) state.items[id].relation = [oldFrom, to];
    },
    findEntryNode: (state) => {
      const items = Object.values(state.items);
      const nodesFrom: Array<string> = [];
      const nodesTo: Array<string> = [];
      items.forEach(({ relation: [relFrom, relTo] }) => {
        nodesFrom.push(relFrom);
        nodesTo.push(relTo);
      });
      state.startNode = nodesFrom.find((node) => !nodesTo.includes(node)) || null;
    },
  },
});

export const {
  addBPRelation,
  removeBPRelation,
  changeBPRelation,
  findEntryNode,
} = bpRelationsSlice.actions;
export const selectStartBPRelation = (state: RootState) => state.bpRelations.startNode;
export const selectBPRelations = (state: RootState) => state.bpRelations.items;

export default bpRelationsSlice.reducer;
