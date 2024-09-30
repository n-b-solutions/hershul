import { Document } from 'mongoose';

export interface RoomStatus extends Document {
    nameRoom: string;
    status: string;
  }
  