import { Router, Request, Response } from 'express';
import { getPublicKey } from '../services/crypto.service';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../services/user.service';
import { CreateUserDTO, UpdateUserDTO, ApiResponse, User } from '../types';

const router = Router();

router.get('/public-key', (_req: Request, res: Response) => {
  try {
    const publicKey = getPublicKey();
    return res.status(200).json({
      success: true,
      data: {
        publicKey,
        algorithm: 'ECDSA',
        curve: 'secp384r1',
        hash: 'SHA-384',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve public key',
    });
  }
});

router.get('/users', (_req: Request, res: Response) => {
  try {
    const users = getAllUsers();
    const response: ApiResponse<User[]> = { success: true, data: users };
    return res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<User[]> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch users',
    };
    return res.status(500).json(response);
  }
});

router.get('/users/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      const response: ApiResponse<User> = { success: false, error: 'Invalid user ID' };
      return res.status(400).json(response);
    }

    const user = getUserById(id);
    if (!user) {
      const response: ApiResponse<User> = { success: false, error: 'User not found' };
      return res.status(404).json(response);
    }

    const response: ApiResponse<User> = { success: true, data: user };
    return res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<User> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user',
    };
    return res.status(500).json(response);
  }
});

router.post('/users', (req: Request, res: Response) => {
  try {
    const userData: CreateUserDTO = req.body;
    if (!userData.email || !userData.role || !userData.status) {
      const response: ApiResponse<User> = {
        success: false,
        error: 'Missing required fields: email, role, status',
      };
      return res.status(400).json(response);
    }

    if (!['admin', 'user', 'guest'].includes(userData.role)) {
      const response: ApiResponse<User> = {
        success: false,
        error: 'Invalid role. Must be: admin, user, or guest',
      };
      return res.status(400).json(response);
    }

    if (!['active', 'inactive'].includes(userData.status)) {
      const response: ApiResponse<User> = {
        success: false,
        error: 'Invalid status. Must be: active or inactive',
      };
      return res.status(400).json(response);
    }

    const newUser = createUser(userData);
    const response: ApiResponse<User> = { success: true, data: newUser };
    return res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<User> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user',
    };
    const statusCode = error instanceof Error && error.message.includes('already exists') ? 400 : 500;
    return res.status(statusCode).json(response);
  }
});

router.put('/users/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      const response: ApiResponse<User> = { success: false, error: 'Invalid user ID' };
      return res.status(400).json(response);
    }

    const userData: UpdateUserDTO = req.body;
    if (userData.role && !['admin', 'user', 'guest'].includes(userData.role)) {
      const response: ApiResponse<User> = { success: false, error: 'Invalid role. Must be: admin, user, or guest' };
      return res.status(400).json(response);
    }

    if (userData.status && !['active', 'inactive'].includes(userData.status)) {
      const response: ApiResponse<User> = { success: false, error: 'Invalid status. Must be: active or inactive' };
      return res.status(400).json(response);
    }

    const updatedUser = updateUser(id, userData);
    const response: ApiResponse<User> = { success: true, data: updatedUser };
    return res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<User> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user',
    };
    const statusCode = error instanceof Error && error.message === 'User not found' ? 404 : 500;
    return res.status(statusCode).json(response);
  }
});

router.delete('/users/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      const response: ApiResponse<null> = { success: false, error: 'Invalid user ID' };
      return res.status(400).json(response);
    }

    deleteUser(id);
    const response: ApiResponse<null> = { success: true, data: undefined };
    return res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user',
    };
    const statusCode = error instanceof Error && error.message === 'User not found' ? 404 : 500;
    return res.status(statusCode).json(response);
  }
});

export default router;
