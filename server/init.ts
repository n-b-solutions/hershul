import express from "express";
import cors from "cors";
import helmet from "helmet";
import axios from "axios";

import connectDB from "./DB/mongoConnect";
import { initSocketio } from "./socketio";
import { router } from "./router";
import RoomService from "./services/room.service";
import errorHandler from "./middlewares/error-handler.middleware";

export const initializeApp = async (app: express.Application, server: any) => {
  try {
    // Set a default timeout for all Axios requests
    axios.defaults.timeout = 5000; // 5 seconds timeout

    await connectDB();
    // get the rooms for start polling for the room's ControlByWeb device
    await RoomService.get();

    //connect to socket io
    initSocketio(server);

    // set security HTTP headers
    app.use(helmet());
    // parse json request body
    app.use(express.json({ limit: "50mb" }));
    // parse urlencoded request body
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(cors());

    app.use("/", router);

    // Use the error handling middleware
    app.use(errorHandler);
  } catch (err) {
    console.error("Error during initialization:", err);
  }
};
