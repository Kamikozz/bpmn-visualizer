import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState, AppThunk } from '../store';
import { getId } from '../../utils';
import {
  BPRelation,
  BPRelations,
  BPRelationsState,
} from '../bpRelations/bpRelationsSlice';
import {
  RoleActionMapState,
} from '../roleActionMap/roleActionMapSlice';
import { RolesState } from '../roles/rolesSlice';

interface Message {
  id: string;
  text: string;
};
export interface Statement {
  id: string;
  roleActionRelationId: string; // по этому полю можно найти roleId и actionId (то есть названия роли и название действия), а также по actionId можно найти названия для полей конкретной роли и действия
  message: Message;
};
export interface DocumentWithMessages {
  id: string;
  statements: Record<string, Statement>;
};
export interface Config {
  roles: RolesState;
  roleActionMap: RoleActionMapState;
  bpRelations: BPRelationsState;
};
export interface ConfigsState {
  config: Config | null;
};

const clearDocuments = (roleActionMap: RoleActionMapState) => {
  const ret: RoleActionMapState = {};
  const entries = Object.entries(roleActionMap);
  entries.forEach(([roleActionId, roleAction]) => {
    const mutatedValue = { ...roleAction };
    mutatedValue.documents = [];
    ret[roleActionId] = mutatedValue;
  });
  return ret;
};

const createNewMessage = (text: string): Message => {
  return {
    id: getId('message'),
    text,
  };
};
export const createNewStatement = (text: string, roleActionRelationId: string = ''): Statement => {
  return {
    id: getId('statement'),
    roleActionRelationId,
    message: createNewMessage(text),
  };
};
export const createNewDocument = (text: string): DocumentWithMessages => {
  const statement = createNewStatement(text);
  return {
    id: getId('document'),
    statements: {
      [statement.id]: statement,
    },
  };
};

const findNextNode = (bpRelations: BPRelations, roleActionRelationFromId: string) => {
  const foundBPRelation: BPRelation | undefined = Object
    .values(bpRelations)
    .find(({ relation: [relFrom,] }) => {
      return relFrom === roleActionRelationFromId;
    });
  if (foundBPRelation) {
    const [, relTo] = foundBPRelation.relation;
    return relTo;
  }
  return null;
};

const initialState: ConfigsState = {
  config: null,
};

export const configsSlice = createSlice({
  name: 'configs',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Config>) => {
      state.config = action.payload;
    },
    // remove: (state, action: PayloadAction<string>) => {
    //   delete state[action.payload];
    // },
    assignDocumentToRoleActionRelation: (state, action: PayloadAction<{
      roleActionRelationId: string;
      document: DocumentWithMessages;
    }>) => {
      const { roleActionRelationId, document } = action.payload;
      state.config?.roleActionMap[roleActionRelationId].documents.push(document);
    },
    addStatementToDocument: (state, action: PayloadAction<{
      statement: Statement;
      document: DocumentWithMessages;
    }>) => {
      if (!state.config) return;
      const { roleActionMap } = state.config;
      const { statement, document } = action.payload;
      const { roleActionRelationId } = statement;
      const { documents } = roleActionMap[roleActionRelationId];
      const foundDocument = documents.find(({ id }) => id === document.id)!;
      foundDocument.statements[statement.id] = statement;
    },
    moveDocumentNext: (state, action: PayloadAction<{
      document: DocumentWithMessages;
      currentRoleActionId: string;
      nextRoleActionId: string | null;
    }>) => {
      if (!state.config) return;
      const { roleActionMap } = state.config;
      const { document, currentRoleActionId, nextRoleActionId } = action.payload;
      const currentRoleAction = roleActionMap[currentRoleActionId];
      currentRoleAction.documents = currentRoleAction.documents.filter(({ id }) => id !== document.id);
      if (nextRoleActionId) {
        const nextRoleAction = roleActionMap[nextRoleActionId];
        nextRoleAction.documents.push(document);
      }
    },
  },
});

export const {
  add,
  assignDocumentToRoleActionRelation,
  addStatementToDocument,
  moveDocumentNext,
} = configsSlice.actions;
export const selectConfig = (state: RootState) => state.configs.config;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const initNewDocument = (text: string): AppThunk => (
  dispatch,
  getState,
) => {
  const config = selectConfig(getState());
  if (!config) return;
  const { entryNode } = config.bpRelations;
  if (entryNode) {
    const document = createNewDocument(text);
    dispatch(assignDocumentToRoleActionRelation({
      roleActionRelationId: entryNode,
      document,
    }));
  }
};

export const addNewStatementToDocumentAndMoveDocumentNext = (
  text: string,
  roleActionRelationId: string,
  document: DocumentWithMessages,
): AppThunk => (
  dispatch,
  getState,
) => {
  let config = selectConfig(getState());
  if (!config) return;
  const statement = createNewStatement(text, roleActionRelationId);
  dispatch(addStatementToDocument({
    statement,
    document,
  }));

  config = selectConfig(getState());
  if (!config) return;
  const { roleActionMap, bpRelations } = config;
  const documentWithStatement = roleActionMap[roleActionRelationId].documents
    .find(({ id }) => id === document.id)!;
  const nextRoleActionId = findNextNode(bpRelations.items, roleActionRelationId);
  dispatch(moveDocumentNext({
    document: documentWithStatement,
    currentRoleActionId: roleActionRelationId,
    nextRoleActionId,
  }));
};

export const addConfig = (): AppThunk => (
  dispatch,
  getState,
) => {
  const { roles, roleActionMap, bpRelations } = getState();
  dispatch(add({
    roles,
    roleActionMap: clearDocuments(roleActionMap),
    bpRelations,
  }));
};

export default configsSlice.reducer;
