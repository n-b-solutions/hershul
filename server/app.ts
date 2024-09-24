import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";

import connectDB from "./DB/mongoConnect";
import { initSocketio } from "./socketio";
import { router } from "./router";

const app = express();

//connect to DB
connectDB();
//create server
const server = createServer(app);
//connect to socket io
initSocketio();

// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json({ limit: "50mb" }));
// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

app.use("/", router);

server.listen(process.env.VITE_PORT ? +process.env.VITE_PORT : 4000, () => {
  console.log("Server is running on port 4000");
});

export const viteNodeApp = app;
