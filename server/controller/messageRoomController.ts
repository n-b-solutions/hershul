import { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import MessageModel from "../models/messageModel";

// Get __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Extend Express Request type to include Multer file properties
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File; // Correctly use Express.Multer.File
      files?:
        | { [fieldname: string]: Express.Multer.File[] }
        | Express.Multer.File[]; // Matches the Multer definition
    }
  }
}

const uploadDir = path.join(__dirname, "..", "uploads", "audio");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
  get: async (req: Request, res: Response): Promise<void> => {
    try {
      const messages = await MessageModel.find();
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const message = await MessageModel.findById(id);
      if (!message) {
        res.status(404).send("Message not found");
        return;
      }
      res.status(200).json(message);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  },

  post: async (req: Request, res: Response): Promise<void> => {
    upload.single("audioBlob")(req, res, async (err: any) => {
      if (err) {
        res.status(500).send("Error uploading file");
        return;
      }

      const file = req.file;
      if (!file) {
        res.status(400).send("No file uploaded.");
        return;
      }

      const filePath = path.join("uploads", "audio", file.filename);
      const { name, selectedRoom } = req.body;
      console.log(selectedRoom);

      const newMessage = new MessageModel({
        selectedRoom,
        name,
        audioUrl: filePath,
      });

      await newMessage.save();
      res.status(201).json({ filePath });
    });
  },

  put: async (req: Request, res: Response): Promise<void> => {
    try {
      res.send("Resource updated");
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const deleteMessage = await MessageModel.findByIdAndDelete(id);
      if (!deleteMessage) {
        res.status(404).send("Message not found");
        return;
      }
      res.status(200).send("Message deleted");
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  },
};

export default MessageRoomController;
