import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";
import { MessageRoom, MessageRoomState } from "@/types/message";




const initialState: MessageRoomState = {
  rooms: [],
  loading: false,
  error: null,
};

const API_BASE_URL =import.meta.env.VITE_LOCAL_SERVER;

export const fetchMessageRooms = createAsyncThunk(
  "messageRoom/fetchMessageRooms",
  async () => {
    const response = await axios.get<MessageRoom[]>(`${API_BASE_URL}/message`);
    return response.data;
  }
);

export const fetchMessageRoomById = createAsyncThunk(
  "messageRoom/fetchMessageRoomById",
  async (id: string) => {
    const response = await axios.get<MessageRoom>(`${API_BASE_URL}/message/${id}`);
    return response.data;
  }
);

export const createMessageRoom = createAsyncThunk(
  'messageRoom/createMessageRoom',
  async (newRoom: Omit<MessageRoom, 'id'>) => {
    const formData = new FormData();
    formData.append('selectedRoom',newRoom.selectedRoom)
    console.log(newRoom.selectedRoom);
    
    formData.append('name', newRoom.name);
    if (newRoom.audioBlob) {
      formData.append('audioBlob', newRoom.audioBlob, 'audio.wav');
    }

    const response = await axios.post<MessageRoom>(`${API_BASE_URL}/message`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
);

export const updateMessageRoom = createAsyncThunk(
  "messageRoom/updateMessageRoom",
  async ({ id, updatedRoom }: { id: string; updatedRoom: Partial<MessageRoom> }) => {
    const response = await axios.put<MessageRoom>(`${API_BASE_URL}/message/${id}`, updatedRoom);
    return response.data;
  }
);

export const deleteMessageRoom = createAsyncThunk(
  "messageRoom/deleteMessageRoom",
  async (id: string) => {
    await axios.delete(`${API_BASE_URL}/message/${id}`);
    return id;
  }
);

const messageRoomSlice = createSlice({
  name: "messageRoom",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessageRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessageRooms.fulfilled, (state, action: PayloadAction<MessageRoom[]>) => {
        state.rooms = action.payload;
        state.loading = false;
      })
      .addCase(fetchMessageRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch message rooms";
      })
      
      .addCase(fetchMessageRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessageRoomById.fulfilled, (state, action: PayloadAction<MessageRoom>) => {
        const roomIndex = state.rooms.findIndex(room => room.id === action.payload.id);
        if (roomIndex >= 0) {
          state.rooms[roomIndex] = action.payload;
        } else {
          state.rooms.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(fetchMessageRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch message room";
      })
      
      .addCase(createMessageRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMessageRoom.fulfilled, (state, action: PayloadAction<MessageRoom>) => {
        state.rooms.push(action.payload);
        state.loading = false;
      })
      .addCase(createMessageRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create message room";
      })
      
      .addCase(updateMessageRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMessageRoom.fulfilled, (state, action: PayloadAction<MessageRoom>) => {
        const index = state.rooms.findIndex(room => room.id === action.payload.id);
        if (index >= 0) {
          state.rooms[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateMessageRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update message room";
      })
      
      .addCase(deleteMessageRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessageRoom.fulfilled, (state, action: PayloadAction<string>) => {
        state.rooms = state.rooms.filter(room => room.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteMessageRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete message room";
      });
  },
});

export const selectMessageRooms = (state: RootState) => state.messageRoom.rooms;
export const selectMessageRoomLoading = (state: RootState) => state.messageRoom.loading;
export const selectMessageRoomError = (state: RootState) => state.messageRoom.error;

export default messageRoomSlice.reducer;
