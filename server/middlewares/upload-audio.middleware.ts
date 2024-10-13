import multer from "multer";
import fs from "fs";
import path from "path";

// Note: this upload config enable audio uploads only currently

// Extend Express Request type to include Multer file properties
declare module "express-serve-static-core" {
    interface Request {
      file?: Express.Multer.File; // Correctly use Express.Multer.File
      files?:
        | { [fieldname: string]: Express.Multer.File[] }
        | Express.Multer.File[]; // Matches the Multer definition
    }
  }
  
  // Create the uploads directory for storing audio files if it doesn't exist
  const uploadDir = path.join(__dirname, "..", "uploads", "audio");
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
  
  export const upload = multer({ storage });