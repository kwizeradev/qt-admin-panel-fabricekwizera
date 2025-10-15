import db from '../config/database';
import { User, CreateUserDTO, UpdateUserDTO } from '../types';
import { signEmail } from './crypto.service';

export const getAllUsers = (): User[] => {
  try {
    const query = 'SELECT * FROM users ORDER BY createdAt DESC';
    const users = db.prepare(query).all() as User[];
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

export const getUserById = (id: number): User | null => {
  try {
    const query = 'SELECT * FROM users WHERE id = ?';
    const user = db.prepare(query).get(id) as User | undefined;
    return user || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
};

export const getUserByEmail = (email: string): User | null => {
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const user = db.prepare(query).get(email) as User | undefined;
    return user || null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Failed to fetch user by email');
  }
};

export const createUser = (userData: CreateUserDTO): User => {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) throw new Error('Invalid email format');

    const existingUser = getUserByEmail(userData.email);
    if (existingUser) throw new Error('Email already exists');

    const signature = signEmail(userData.email);
    const createdAt = new Date().toISOString();

    const query = `
      INSERT INTO users (email, role, status, createdAt, signature)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = db.prepare(query).run(
      userData.email,
      userData.role,
      userData.status,
      createdAt,
      signature
    );

    const newUser = getUserById(Number(result.lastInsertRowid));
    if (!newUser) throw new Error('Failed to retrieve created user');

    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error instanceof Error ? error : new Error('Unknown error while creating user');
  }
};

export const updateUser = (id: number, userData: UpdateUserDTO): User => {
  try {
    const existingUser = getUserById(id);
    if (!existingUser) throw new Error('User not found');

    if (userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) throw new Error('Invalid email format');

      const userWithEmail = getUserByEmail(userData.email);
      if (userWithEmail && userWithEmail.id !== id) throw new Error('Email already exists');
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (userData.email !== undefined) {
      updates.push('email = ?');
      values.push(userData.email);
      updates.push('signature = ?');
      values.push(signEmail(userData.email));
    }
    if (userData.role !== undefined) {
      updates.push('role = ?');
      values.push(userData.role);
    }
    if (userData.status !== undefined) {
      updates.push('status = ?');
      values.push(userData.status);
    }

    if (updates.length === 0) return existingUser;

    values.push(id);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...values);

    const updatedUser = getUserById(id);
    if (!updatedUser) throw new Error('Failed to retrieve updated user');

    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error instanceof Error ? error : new Error('Unknown error while updating user');
  }
};

export const deleteUser = (id: number): boolean => {
  try {
    const existingUser = getUserById(id);
    if (!existingUser) throw new Error('User not found');

    const query = 'DELETE FROM users WHERE id = ?';
    const result = db.prepare(query).run(id);

    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error instanceof Error ? error : new Error('Unknown error while deleting user');
  }
};
