import { Types } from "mongoose";

import { MessageType } from "../../lib/types/message.type";
import MessageModel from "../models/messageModel";
import { ApiError } from "../../lib/utils/api-error.util";
import { convertMessageDocument } from "../utils/convert-document.util";

const MessageService = {
  get: async (): Promise<MessageType[]> => {
    try {
      const messages = await MessageModel.find();
      return messages.map(convertMessageDocument);
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  getById: async (id?: string): Promise<MessageType> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const message = await MessageModel.findById(id);
      if (!message) {
        throw new ApiError(404, "Message not found");
      }
      return convertMessageDocument(message);
    } catch (error) {
      console.error(`Error fetching message with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  create: async (messageData: MessageType): Promise<MessageType> => {
    try {
      const newMessage = await MessageModel.create(messageData);
      return convertMessageDocument(newMessage);
    } catch (error) {
      console.error("Error creating message:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  update: async (
    messageData: Partial<MessageType>,
    id?: string
  ): Promise<MessageType> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        id,
        messageData,
        { new: true }
      );
      if (!updatedMessage) {
        throw new ApiError(404, "Message not found");
      }
      return convertMessageDocument(updatedMessage);
    } catch (error) {
      console.error(`Error updating message with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  delete: async (id?: string): Promise<void> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const deleteMessage = await MessageModel.findByIdAndDelete(id);
      if (!deleteMessage) {
        throw new ApiError(404, "Message not found");
      }
    } catch (error) {
      console.error(`Error deleting message with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },
};

export default MessageService;
