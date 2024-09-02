import mongoose, { Schema, Document } from 'mongoose';

interface MinyanDocument extends Document {
    room: string;
    messages?: string;
    announcement: boolean;
    startDate: Date;
    endDate: Date;
    
}

const MinyanSchema: Schema<MinyanDocument> = new Schema({
    room: { type: String, required: true },
    messages: { type: String, required: true },
    announcement: { type: Boolean, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

const MinyanListModel = mongoose.model<MinyanDocument>('minyans', MinyanSchema);

export default MinyanListModel;
