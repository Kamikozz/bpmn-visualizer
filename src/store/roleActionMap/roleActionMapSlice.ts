import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState, AppThunk } from '../store';
import { getId } from '../../utils';
import {
  BPRelation,
  BPRelations,
  selectBPRelations,
  selectStartBPRelation,
}  from '../bpRelations/bpRelationsSlice';

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
  // title: string; // для сокращённого вывода текста из сообщений на странице Сообщений
  statements: Record<string, Statement>;
};

export interface RoleActionRelation {
  id: string;
  roleId: string;
  actionId: string;
  documents: Array<DocumentWithMessages>;
};
export interface RoleActionMapState extends Record<string, RoleActionRelation> {};

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
    assignDocumentToRoleActionRelation: (state, action: PayloadAction<{
      roleActionRelationId: string;
      document: DocumentWithMessages;
    }>) => {
      const { roleActionRelationId, document } = action.payload;
      state[roleActionRelationId].documents.push(document);
    },
    addStatementToDocument: (state, action: PayloadAction<{
      statement: Statement;
      document: DocumentWithMessages;
    }>) => {
      const { statement, document } = action.payload;
      const { roleActionRelationId } = statement;
      const { documents } = state[roleActionRelationId];
      const foundDocument = documents.find(({ id }) => id === document.id)!;
      foundDocument.statements[statement.id] = statement;
    },
    moveDocumentNext: (state, action: PayloadAction<{
      document: DocumentWithMessages;
      currentRoleActionId: string;
      nextRoleActionId: string | null;
    }>) => {
      const { document, currentRoleActionId, nextRoleActionId } = action.payload;
      const currentRoleAction = state[currentRoleActionId];
      currentRoleAction.documents = currentRoleAction.documents.filter(({ id }) => id !== document.id);
      if (nextRoleActionId) {
        const nextRoleAction = state[nextRoleActionId];
        nextRoleAction.documents.push(document);
      }
    },
  },
});

export const {
  addRelation,
  removeRelation,
  changeRelation,
  assignDocumentToRoleActionRelation,
  addStatementToDocument,
  moveDocumentNext,
} = roleActionMapSlice.actions;
export const selectRoleActionMap = (state: RootState) => state.roleActionMap;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const initNewDocument = (text: string): AppThunk => (
  dispatch,
  getState,
) => {
  const entryNode = selectStartBPRelation(getState());
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
  const bpRelations = selectBPRelations(getState());
  const statement = createNewStatement(text, roleActionRelationId);
  dispatch(addStatementToDocument({
    statement,
    document,
  }));

  const roleActionMap = selectRoleActionMap(getState());
  const documentWithStatement = roleActionMap[roleActionRelationId].documents
    .find(({ id }) => id === document.id)!;
  const nextRoleActionId = findNextNode(bpRelations, roleActionRelationId);
  dispatch(moveDocumentNext({
    document: documentWithStatement,
    currentRoleActionId: roleActionRelationId,
    nextRoleActionId,
  }));
};

export default roleActionMapSlice.reducer;
