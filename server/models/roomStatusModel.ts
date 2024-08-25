import { Schema, model, Document } from 'mongoose';

interface Asset {
  name: string;
  active: boolean;
}

interface RoomStatus extends Document {
  nameRoom: string;
  assets: Asset[];
}

const AssetSchema = new Schema<Asset>({
  name: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
});

const RoomStatusSchema = new Schema<RoomStatus>({
  nameRoom: {
    type: String,
    required: true
  },
  assets: {
    type: [AssetSchema],
    required: true
  }
});

const RoomStatusModel = model<RoomStatus>('status_rooms', RoomStatusSchema);

export default RoomStatusModel;
