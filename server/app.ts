import express, { Express } from 'express';

const app: Express = express();

// your beautiful code...

// Start the server only in production mode
// if (import.meta.env.PROD) {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
// }

export const viteNodeApp = app;
