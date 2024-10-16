import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';

import connectDB from './DB/mongoConnect';
import { initSocketio } from './socketio';
import { router } from './router';
import { config } from 'dotenv';
import errorHandler from './middlewares/error-handler.middleware';

config();
const app = express();
const server = createServer(app);

//connect to DB
connectDB().catch((err) => console.log(err));

//connect to socket io
initSocketio(server);

// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json({ limit: '50mb' }));
// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

app.use('/', router);

// Use the error handling middleware
app.use(errorHandler);

const port = process.env.VITE_PORT ? +process.env.VITE_PORT : 4000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
