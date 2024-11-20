import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { Message, MessageState } from '@/types/message.type';
import { tFieldMinyanTable } from '@/types/minyans.type';

import { RootState } from '../store';

interface MessagePopupState {
  open: boolean;
  roomName: string;
  minyanId: string;
  field: tFieldMinyanTable;
  index: number;
  messageId?: string;
}

const initialState: MessageState & { popup: MessagePopupState } = {
  messages: [],
  loading: false,
  error: null,
  popup: {
    open: false,
    roomName: '',
    minyanId: '',
    field: 'blink',
    index: 0,
  },
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages(state: MessageState, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
      state.loading = false;
      state.error = null;
    },
    setMessage(state: MessageState, action: PayloadAction<Message>) {
      const messageIndex = state.messages.findIndex(
        (message) => action.payload.id?.toString() === message.id?.toString()
      );
      if (messageIndex >= 0) {
        state.messages[messageIndex] = action.payload;
      } else {
        state.messages.push(action.payload);
      }
      state.loading = false;
      state.error = null;
    },
    deleteMessage(state: MessageState, action: PayloadAction<string>) {
      state.messages = state.messages.filter((message) => message.id !== action.payload);
      state.loading = false;
    },
    setPopupOpen(
      state,
      action: PayloadAction<{
        open: boolean;
        roomName: string;
        minyanId: string;
        field: tFieldMinyanTable;
        index: number;
        messageId?: string;
      }>
    ) {
      state.popup = { ...state.popup, ...action.payload };
    },
    setLoading(state: MessageState, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state: MessageState, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setMessages, setMessage, deleteMessage, setPopupOpen, setLoading, setError } =
  messageSlice.actions;

export const selectMessages = (state: RootState) => state.message.messages;
export const selectPopupState = (state: RootState) => state.message.popup;
export const messageLoading = (state: RootState) => state.message.loading;
export const messageError = (state: RootState) => state.message.error;

export default messageSlice.reducer;
