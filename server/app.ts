import express from "express";
import { createServer } from "http";

import { initializeApp } from "./init"; // Import the initialization function
import { config } from "dotenv";

config();
const app = express();
const server = createServer(app);

// Initialize the app (connect to DB, get rooms, and set up middleware)
initializeApp(app, server);

const port = process.env.VITE_PORT ? +process.env.VITE_PORT : 4000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
