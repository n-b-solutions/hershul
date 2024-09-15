import express from "express";
import cors from "cors";
import helmet from "helmet";

import { router } from "./router";

const app = express();

// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json({ limit: "50mb" }));
// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

app.use("/", router);

export const viteNodeApp = app;
