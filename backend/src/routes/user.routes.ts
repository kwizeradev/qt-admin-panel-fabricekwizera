import { Router, Request, Response } from 'express';
import { getPublicKey } from '../services/crypto.service';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
} from '../services/user.service';
import { encodeUsers } from '../services/proto.service';
import { CreateUserDTO, UpdateUserDTO } from '../types';
import { sendSuccess, sendError } from '../utils/response';
import { isValidRole, isValidStatus, isValidId } from '../utils/validation';
import { HTTP_STATUS, ERROR_MESSAGES, CONTENT_TYPES, CACHE_CONTROL } from '../constants';

const router = Router();

router.get('/public-key', (_req: Request, res: Response) => {
  try {
    const publicKey = getPublicKey();
    return sendSuccess(res, {
      publicKey,
      algorithm: 'ECDSA',
      curve: 'secp384r1',
      hash: 'SHA-384',
    });
  } catch (error) {
    return sendError(res, ERROR_MESSAGES.FAILED_TO_RETRIEVE_PUBLIC_KEY, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
});

router.get('/users/stats', (_req: Request, res: Response) => {
  try {
    const stats = getUserStats();
    return sendSuccess(res, stats);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_FETCH_STATISTICS;
    return sendError(res, errorMessage, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
});

router.get('/users/export', async (_req: Request, res: Response) => {
  try {
    const users = getAllUsers();
    const binaryData = await encodeUsers(users);

    res.setHeader('Content-Type', CONTENT_TYPES.PROTOBUF);
    res.setHeader('Content-Disposition', 'attachment; filename="users.pb"');
    res.setHeader('Content-Length', binaryData.length.toString());
    res.setHeader('Cache-Control', CACHE_CONTROL.NO_STORE);

    return res.status(HTTP_STATUS.OK).send(binaryData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_EXPORT_USERS;
    return sendError(res, errorMessage, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
});


router.get('/users', (_req: Request, res: Response) => {
  try {
    const users = getAllUsers();
    return sendSuccess(res, users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_FETCH_USERS;
    return sendError(res, errorMessage, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
});


router.get('/users/:id', (req: Request, res: Response) => {
  try {
    const id = isValidId(req.params.id);
    if (!id) {
      return sendError(res, ERROR_MESSAGES.INVALID_USER_ID, HTTP_STATUS.BAD_REQUEST);
    }

    const user = getUserById(id);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_FETCH_USER;
    return sendError(res, errorMessage, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
});

router.post('/users', (req: Request, res: Response) => {
  try {
    const userData: CreateUserDTO = req.body;
    
    if (!userData.email || !userData.role || !userData.status) {
      return sendError(res, ERROR_MESSAGES.MISSING_REQUIRED_FIELDS, HTTP_STATUS.BAD_REQUEST);
    }

    if (!isValidRole(userData.role)) {
      return sendError(res, ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.BAD_REQUEST);
    }

    if (!isValidStatus(userData.status)) {
      return sendError(res, ERROR_MESSAGES.INVALID_STATUS, HTTP_STATUS.BAD_REQUEST);
    }

    const newUser = createUser(userData);
    return sendSuccess(res, newUser, HTTP_STATUS.CREATED);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_CREATE_USER;
    const statusCode = error instanceof Error && error.message === ERROR_MESSAGES.DUPLICATE_EMAIL
      ? HTTP_STATUS.BAD_REQUEST 
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;
    return sendError(res, errorMessage, statusCode);
  }
});

router.put('/users/:id', (req: Request, res: Response) => {
  try {
    const id = isValidId(req.params.id);
    if (!id) {
      return sendError(res, ERROR_MESSAGES.INVALID_USER_ID, HTTP_STATUS.BAD_REQUEST);
    }

    const userData: UpdateUserDTO = req.body;
    
    if (userData.role && !isValidRole(userData.role)) {
      return sendError(res, ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.BAD_REQUEST);
    }

    if (userData.status && !isValidStatus(userData.status)) {
      return sendError(res, ERROR_MESSAGES.INVALID_STATUS, HTTP_STATUS.BAD_REQUEST);
    }

    const updatedUser = updateUser(id, userData);
    return sendSuccess(res, updatedUser);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_UPDATE_USER;
    const statusCode = error instanceof Error && error.message === ERROR_MESSAGES.USER_NOT_FOUND
      ? HTTP_STATUS.NOT_FOUND 
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;
    return sendError(res, errorMessage, statusCode);
  }
});

router.delete('/users/:id', (req: Request, res: Response) => {
  try {
    const id = isValidId(req.params.id);
    if (!id) {
      return sendError(res, ERROR_MESSAGES.INVALID_USER_ID, HTTP_STATUS.BAD_REQUEST);
    }

    deleteUser(id);
    return sendSuccess(res, null);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_DELETE_USER;
    const statusCode = error instanceof Error && error.message === ERROR_MESSAGES.USER_NOT_FOUND
      ? HTTP_STATUS.NOT_FOUND 
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;
    return sendError(res, errorMessage, statusCode);
  }
});

export default router;