import { Schema, model, Document } from 'mongoose';


interface RoomStatus extends Document {
  nameRoom: string;
  status: string;
}

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
