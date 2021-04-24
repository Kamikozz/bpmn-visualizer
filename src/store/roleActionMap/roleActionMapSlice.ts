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
    addNewStatementToDocument: (state, action: PayloadAction<{
      text: string;
      roleActionRelationId: string;
      document: DocumentWithMessages;
    }>) => {
      const { text, roleActionRelationId, document } = action.payload;
      const { documents } = state[roleActionRelationId];
      const foundDocument = documents.find(({ id }) => id === document.id)!;
      const statement = createNewStatement(text, roleActionRelationId);
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
    addStatementToDocumentAndMoveDocumentNext: (state, action: PayloadAction<{
      statement: Statement;
      document: DocumentWithMessages;
      currentRoleActionId: string;
      nextRoleActionId: string | null;
    }>) => {
      const { statement, document, currentRoleActionId, nextRoleActionId } = action.payload;
      const currentRoleAction = state[currentRoleActionId];
      const foundDocument = currentRoleAction.documents.find(({ id }) => id === document.id)!;
      foundDocument.statements[statement.id] = statement;

      currentRoleAction.documents = currentRoleAction.documents.filter(({ id }) => id !== document.id);
      if (nextRoleActionId) {
        const nextRoleAction = state[nextRoleActionId];
        nextRoleAction.documents.push(foundDocument);
      }
    },

    // addMessageByRoleActionId: (state, action: PayloadAction<{
    //   roleActionId: string;
    //   text: string;
    // }>) => {
    //   const { roleActionId, text } = action.payload;
    //   const message = createNewMessage(text);
    //   const relation = state[roleActionId];
    //   relation.messages[message.id] = message;
    // },
    // moveMessageToRoleActionId: (state, action: PayloadAction<{
    //   messageId: string;
    //   roleActionFromId: string;
    //   roleActionToId: string;
    // }>) => {
    //   const { messageId, roleActionId } = action.payload;
    //   const relation = state[];
    // },
  },
});

export const {
  addRelation,
  removeRelation,
  changeRelation,
  assignDocumentToRoleActionRelation,
  addNewStatementToDocument,
  moveDocumentNext,
  addStatementToDocumentAndMoveDocumentNext,
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

// addNewStatementToDocumentAndMoveDocumentNext

export const addNewStatementToDocumentFindNextRoleActionMoveDocument = (
  text: string,
  roleActionRelationId: string,
  document: DocumentWithMessages,
): AppThunk => (
  dispatch,
  getState,
) => {
  const statement = createNewStatement(text, roleActionRelationId);
  const bpRelations = selectBPRelations(getState());
  const nextRoleActionId = findNextNode(bpRelations, roleActionRelationId);
  dispatch(addStatementToDocumentAndMoveDocumentNext({
    statement,
    document,
    currentRoleActionId: roleActionRelationId,
    nextRoleActionId,
  }));
};

export const findAndMoveDocumentNext = (
  roleActionRelationId: string,
  document: DocumentWithMessages,
): AppThunk => (
  dispatch,
  getState,
) => {
  const bpRelations = selectBPRelations(getState());
  const nextRoleActionId = findNextNode(bpRelations, roleActionRelationId);
  dispatch(moveDocumentNext({
    document,
    currentRoleActionId: roleActionRelationId,
    nextRoleActionId,
  }));
};

// export const addNewStatementToDocument = (
//   text: string,
//   roleActionRelationId: string,
//   document: DocumentWithMessages,
// ): AppThunk => (
//   dispatch,
//   getState,
// ) => {
//   const bpRelations = selectBPRelations(getState());
//   const statement = createNewStatement(text, roleActionRelationId);
//   dispatch(addStatementToDocument({
//     statement,
//     document,
//   }));

//   const nextRoleActionId = findNextNode(bpRelations, roleActionRelationId);
//   dispatch(moveDocumentNext({
//     document,
//     currentRoleActionId: roleActionRelationId,
//     nextRoleActionId,
//   }));
// };

export default roleActionMapSlice.reducer;
