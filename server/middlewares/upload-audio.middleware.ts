import multer from "multer";
import fs from "fs";
import path from "path";

// Note: this upload config enables audio uploads only currently

// Extend Express Request type to include Multer file properties
declare module "express-serve-static-core" {}

// Create the uploads directory for storing audio files if it doesn't exist
const uploadDir = path.resolve(process.cwd(), "uploads", "audio");
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
    const basename = path.basename(file.originalname, ext).replace(/\s+/g, '_'); // Replace spaces with underscores
    const name = req.body.name ? req.body.name.replace(/\s+/g, '_') : basename; // Replace spaces with underscores
    cb(null, `${name}${ext}`);
  },
});

export const upload = multer({ storage });
