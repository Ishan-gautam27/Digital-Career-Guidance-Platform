import { Request, Response } from 'express';

export const checkHealth = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend API is healthy and running',
    timestamp: new Date().toISOString()
  });
};
