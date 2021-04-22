import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { getId } from '../../utils';

export interface Message {
  id: string;
  message: string;
};
export interface MessagesMapState extends Record<string, Message> {};

export const createNewMessage = (message: string): Message => {
  return {
    id: getId('message'),
    message,
  };
};

const initialState: MessagesMapState = {};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<string>) => {
      const message = createNewMessage(action.payload);
      state[message.id] = message;
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    // changeRelation: (state, action: PayloadAction<{
    //   id: string;
    //   roleId?: string;
    //   actionId?: string;
    // }>) => {
    //   const { id, roleId, actionId } = action.payload;
    //   const relation = state[id];
    //   if (roleId) relation.roleId = roleId;
    //   if (actionId) relation.actionId = actionId;
    // },
  },
});

export const { addMessage, removeMessage } = messagesSlice.actions;
export const selectMessages = (state: RootState) => state.messages;

export default messagesSlice.reducer;
