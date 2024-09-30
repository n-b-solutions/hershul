import { API_BASE_URL } from '@/consts/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { Room } from '@/types/room';

import { RootState } from '../store';

// Async thunk to fetch room statuses
interface RoomsState {
  rooms: Room[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Async thunk to fetch room statuses
export const fetchRooms = createAsyncThunk<Room[], void, { rejectValue: string }>(
  'rooms/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/roomStatus`);
      return response.data as Room[];
    } catch (error: any) {
      return rejectWithValue(error.response.data || 'Failed to fetch rooms');
    }
  }
);

// Async thunk to update room status
export const updateRoomStatus = createAsyncThunk<
  { id: string; newStatus: 'on' | 'off' | 'blink' },
  { id: string; newStatus: 'on' | 'off' | 'blink' },
  { rejectValue: string }
>('rooms/updateRoomStatus', async ({ id, newStatus }, { rejectWithValue }) => {
  try {
    await axios.put(`${API_BASE_URL}/roomStatus/${id}`, { status: newStatus });
    return { id, newStatus };
  } catch (error: any) {
    return rejectWithValue(error.response.data || 'Failed to update room status');
  }
});

// Define initial state
const initialState: RoomsState = {
  rooms: [],
  status: 'idle',
  error: null,
};

// Slice definition
const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    updateRoomState: (state, action: PayloadAction<{ nameRoom: string; newStatus: 'on' | 'off' | 'blink' }>) => {
      const { nameRoom, newStatus } = action.payload;
      state.rooms = state.rooms.map((room) => (room.nameRoom === nameRoom ? { ...room, status: newStatus } : room));
    },
    setRoomStatusFromSocket: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRooms.fulfilled, (state, action: PayloadAction<Room[]>) => {
        state.status = 'succeeded';
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(
        updateRoomStatus.fulfilled,
        (state, action: PayloadAction<{ id: string; newStatus: 'on' | 'off' | 'blink' }>) => {
          const { id, newStatus } = action.payload;
          const room = state.rooms.find((room) => room.id === id);
          if (room) {
            room.status = newStatus;
          }
        }
      );
  },
});
export const selectRooms = (state: RootState) => state.rooms.rooms;
export const selectRoomsLoading = (state: RootState) => state.rooms.status === 'loading';

export const { updateRoomState, setRoomStatusFromSocket } = roomsSlice.actions;

export default roomsSlice.reducer;
