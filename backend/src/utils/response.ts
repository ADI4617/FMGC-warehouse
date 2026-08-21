import { Response } from 'express';

export function sendSuccess(res: Response, data: unknown, message?: string, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(message && { message }),
  });
}

export function sendCreated(res: Response, data: unknown, message?: string) {
  return sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response) {
  return res.status(204).send();
}
