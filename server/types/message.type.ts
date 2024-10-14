import { Document } from 'mongoose';

export interface MessageDocument extends Document {
    name: string;
    audioUrl: string;
    selectedRoom:string;
}