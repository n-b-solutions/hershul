import mongoose, { Document, Schema } from 'mongoose';

interface IMessage extends Document {
    name: string;
    audioUrl: string;
    selectedRoom:string;
}

const messageSchema: Schema = new Schema({
    name: { type: String, required: true },
    audioUrl: { type: String, required: true },
    selectedRoom: { type: String, required: true }
});


const MessageModel = mongoose.model<IMessage>('messages', messageSchema);

export default MessageModel;
