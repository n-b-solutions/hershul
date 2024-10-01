import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';

import connectDB from './DB/mongoConnect';
import { initSocketio } from './socketio';
import { router } from './router';

const app = express();
const server = createServer(app);

//connect to DB
connectDB().catch((err) => console.log(err));

//connect to socket io
initSocketio();

// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json({ limit: '50mb' }));
// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

app.use('/', router);

if (process.env.NODE_ENV === 'production') {
  const port = process.env.VITE_PORT ? +process.env.VITE_PORT : 4000;
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export const viteNodeApp = app;
