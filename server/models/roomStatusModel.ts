import { Schema, model, Document } from 'mongoose';
import { RoomStatus } from '../types/room';



const RoomStatusSchema = new Schema<RoomStatus>({
  nameRoom: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
});

const RoomStatusModel = model<RoomStatus>('rooms', RoomStatusSchema);

export default RoomStatusModel;
