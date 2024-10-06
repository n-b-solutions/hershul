import { API_BASE_URL } from '@/const/api.const';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { Message } from '@/types/message.type';

import { AppThunk } from '../store';
import { deleteMessage as deleteMessageSlice, setMessage, setMessages } from './messageSlice';

export const fetchMessages = (): AppThunk<Message[]> => async (dispatch) => {
  const response = await axios.get<Message[]>(`${API_BASE_URL}/message`);
  dispatch(setMessages(response.data));
  return response.data;
};

export const fetchMessageById =
  (id: string): AppThunk<Message> =>
  async (dispatch) => {
    const response = await axios.get<Message>(`${API_BASE_URL}/message/${id}`);
    dispatch(setMessage(response.data));
    return response.data;
  };

export const createMessage =
  (newMessage: Omit<Message, 'id'>): AppThunk<Message> =>
  async (dispatch) => {
    const formData = new FormData();
    formData.append('selectedRoom', newMessage.selectedRoom);
    formData.append('name', newMessage.name);
    if (newMessage.audioBlob) {
      formData.append('audioBlob', newMessage.audioBlob, 'audio.wav');
    }
    const response = await axios.post<Message>(`${API_BASE_URL}/message`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(setMessage(response.data));
    return response.data;
  };

export const updateMessage =
  ({ id, updatedMessage }: { id: string; updatedMessage: Partial<Message> }): AppThunk<Message> =>
  async (dispatch) => {
    const response = await axios.put<Message>(`${API_BASE_URL}/message/${id}`, updatedMessage);
    dispatch(setMessage(response.data));
    return response.data;
  };

export const deleteMessage =
  (id: string): AppThunk<string> =>
  async (dispatch) => {
    await axios.delete(`${API_BASE_URL}/message/${id}`);
    dispatch(deleteMessageSlice(id));
    return id;
  };
