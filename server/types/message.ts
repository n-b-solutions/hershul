import { Document } from 'mongoose';

export interface IMessage extends Document {
    name: string;
    audioUrl: string;
    selectedRoom:string;
}