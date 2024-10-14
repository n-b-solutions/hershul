import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../lib/utils/api-error.util';

function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error(err); // Log the error for debugging purposes

  if (err instanceof ApiError) {
    // If the error is an instance of ApiError, use its status and message
    res.status(err.status).json({ message: err.message });
  } else {
    // For other errors, use a generic 500 status code
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default errorHandler;