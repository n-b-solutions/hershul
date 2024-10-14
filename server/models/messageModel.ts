import mongoose, { Schema } from "mongoose";
import { MessageDocument } from "../types/message.type";

const messageSchema: Schema = new Schema({
  name: { type: String, required: true },
  audioUrl: { type: String, required: true },
  selectedRoom: { type: String, required: true },
});

const MessageModel = mongoose.model<MessageDocument>("messages", messageSchema);

export default MessageModel;
