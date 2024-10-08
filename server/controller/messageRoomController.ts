import { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import MessageModel from '../models/messageModel';

// Extend Express Request type to include Multer file properties
declare module 'express-serve-static-core' {
  interface Request {
    file?: Express.Multer.File; // Correctly use Express.Multer.File
    files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[]; // Matches the Multer definition
  }
}

// Create the uploads directory for storing audio files if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads', 'audio');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Define Multer storage configuration for saving files to disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const name = req.body.name || basename;
    cb(null, `${name}${ext}`);
  },
});

const upload = multer({ storage });

const MessageRoomController = {
  // Get all messages
  get: async (req: Request, res: Response): Promise<void> => {
    try {
      const messages = await MessageModel.find();
      res.status(200).json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Get a specific message by its ID
  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const message = await MessageModel.findById(id);
      if (!message) {
        res.status(404).send('Message not found');
        return;
      }
      res.status(200).json(message);
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  },
  // Upload an audio file and create a new message
  post: async (req: Request, res: Response): Promise<void> => {
    upload.single('audioBlob')(req, res, async (err: any) => {
      if (err) {
        res.status(500).send('Error uploading file');
        return;
      }

      const file = req.file;
      if (!file) {
        res.status(400).send('No file uploaded.');
        return;
      }

      const filePath = path.join('uploads', 'audio', file.filename);
      const { name, selectedRoom } = req.body;

      const newMessage = new MessageModel({
        selectedRoom,
        name,
        //Save the path to the uploaded file
        audioUrl: filePath,
      });

      await newMessage.save();
      res.status(201).json(newMessage);
    });
  },
  // Update an existing message
  put: async (req: Request, res: Response): Promise<void> => {
    try {
      res.send('Resource updated');
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const deleteMessage = await MessageModel.findByIdAndDelete(id);
      if (!deleteMessage) {
        res.status(404).send('Message not found');
        return;
      }
      res.status(200).send('Message deleted');
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  },
};

export default MessageRoomController;
