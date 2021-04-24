import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState, AppThunk } from '../store';
import { getId } from '../../utils';

export interface BPRelation {
  id: string;
  relation: Array<string>;
};
export interface BPRelations extends Record<string, BPRelation> {};
export interface BPRelationsState {
  items: BPRelations;
  entryNode: string | null;
};

interface BPRelationChange {
  id: string;
  from?: string;
  to?: string;
};

export const createNewRelation = (relation: Array<string>): BPRelation => {
  return {
    id: getId('bpRelation'),
    relation,
  };
};

const findEntryNode = (bpRelations: BPRelations) => {
  const items = Object.values(bpRelations);
  const nodesFrom: Array<string> = [];
  const nodesTo: Array<string> = [];
  items.forEach(({ relation: [relFrom, relTo] }) => {
    nodesFrom.push(relFrom);
    nodesTo.push(relTo);
  });
  return nodesFrom.find((node) => !nodesTo.includes(node)) || null;
};

const initialState: BPRelationsState = {
  items: {},
  entryNode: null,
};

export const bpRelationsSlice = createSlice({
  name: 'bpRelations',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<BPRelation>) => {
      state.items[action.payload.id] = action.payload;
    },
    remove: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    change: (state, action: PayloadAction<BPRelationChange>) => {
      const { id, from, to } = action.payload;
      const [oldFrom, oldTo] = state.items[id].relation;
      if (from) state.items[id].relation = [from, oldTo];
      if (to) state.items[id].relation = [oldFrom, to];
    },
    updateEntryNode: (state) => {
      state.entryNode = findEntryNode(state.items);
    },
  },
});

const {
  add,
  remove,
  change,
  updateEntryNode,
} = bpRelationsSlice.actions;
export const selectStartBPRelation = (state: RootState) => state.bpRelations.entryNode;
export const selectBPRelations = (state: RootState) => state.bpRelations.items;

export const addBPRelation = (
  relation: Array<string>,
): AppThunk => (
  dispatch,
  getState,
) => {
  const bpRelation = createNewRelation(relation);
  dispatch(add(bpRelation));
  dispatch(updateEntryNode());
};

export const removeBPRelation = (
  bpRelationId: string,
): AppThunk => (
  dispatch,
  getState,
) => {
  dispatch(remove(bpRelationId));
  dispatch(updateEntryNode());
};

export const changeBPRelation = (prevBPRelation: BPRelationChange): AppThunk => (
  dispatch,
  getState,
) => {
  dispatch(change(prevBPRelation));
  dispatch(updateEntryNode());
};


export default bpRelationsSlice.reducer;
