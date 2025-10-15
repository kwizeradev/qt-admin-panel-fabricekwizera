import { Response } from 'express';
import { ApiResponse } from '../types';
import { HTTP_STATUS } from '../constants';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  data?: T,
  error?: string
): Response => {
  const response: ApiResponse<T> = { success, data, error };
  return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(res: Response, data?: T, statusCode: number = HTTP_STATUS.OK): Response => {
  return sendResponse(res, statusCode, true, data);
};

export const sendError = (res: Response, error: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR): Response => {
  return sendResponse(res, statusCode, false, undefined, error);
};

