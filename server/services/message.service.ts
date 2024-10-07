import MessageModel from "../models/messageModel";
import { IMessage } from "../types/message";
import { ApiError } from "../../lib/utils/api-error.util";
import path from "path";

const MessageService = {
  // Get all messages
  get: async (): Promise<IMessage[] | ApiError> => {
    try {
        console.log('service');
        
      const messages = await MessageModel.find();
      return messages;
    } catch (error) {
      return new ApiError(500, error);
    }
  },
  // Get a specific message by its ID
  getById: async (id?: string): Promise<IMessage | ApiError> => {
    try {
      if (!id) {
        return new ApiError(404, "Not Found");
      }
      const message = await MessageModel.findById(id);
      if (!message) {
        return new ApiError(404, "Not Found");
      }
      return message;
    } catch (error) {
      return new ApiError(500, error);
    }
  },
  // Upload an audio file and create a new message
  post: async (
    selectedRoom: string,
    name: string,
    file?: Express.Multer.File
  ): Promise<IMessage | ApiError> => {
    if (!file) {
      return new ApiError(400, "No file uploaded.");
    }
    const filePath = path.join("uploads", "audio", file.filename);
    const newMessage = new MessageModel({
      selectedRoom,
      name,
      audioUrl: filePath,
    });
    await newMessage.save();
    return newMessage;
  },
  delete: async (id?: string): Promise<void | ApiError> => {
    try {
      if (!id) {
        return new ApiError(404, "Not Found");
      }
      const deleteMessage = await MessageModel.findByIdAndDelete(id);
      if (!deleteMessage) {
        return new ApiError(404, "Message not found");
      }
    } catch (error) {
      console.log(error);
      new ApiError(500, "Internal Server Error");
    }
  },
};

export default MessageService;
