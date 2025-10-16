import db from '../config/database';
import { User, CreateUserDTO, UpdateUserDTO, DailyStats } from '../types';
import { signEmail } from './crypto.service';
import { ERROR_MESSAGES } from '../constants';
import { isValidEmail } from '../utils/validation';

export const getAllUsers = (): User[] => {
  try {
    const query = 'SELECT * FROM users ORDER BY createdAt DESC';
    return db.prepare(query).all() as User[];
  } catch (error) {
    throw new Error(ERROR_MESSAGES.FAILED_TO_FETCH_USERS);
  }
};


export const getUserById = (id: number): User | null => {
  try {
    const query = 'SELECT * FROM users WHERE id = ?';
    const user = db.prepare(query).get(id) as User | undefined;
    return user || null;
  } catch (error) {
    throw new Error(ERROR_MESSAGES.FAILED_TO_FETCH_USER);
  }
};

export const getUserByEmail = (email: string): User | null => {
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const user = db.prepare(query).get(email) as User | undefined;
    return user || null;
  } catch (error) {
    throw new Error(ERROR_MESSAGES.FAILED_TO_FETCH_USER);
  }
};

export const createUser = (userData: CreateUserDTO): User => {
  try {
    if (!isValidEmail(userData.email)) throw new Error('Invalid email format');

    const existingUser = getUserByEmail(userData.email);
    if (existingUser) throw new Error(ERROR_MESSAGES.DUPLICATE_EMAIL);

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
    throw error instanceof Error ? error : new Error(ERROR_MESSAGES.FAILED_TO_CREATE_USER);
  }
};

export const updateUser = (id: number, userData: UpdateUserDTO): User => {
  try {
    const existingUser = getUserById(id);
    if (!existingUser) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

    if (userData.email) {
      if (!isValidEmail(userData.email)) throw new Error('Invalid email format');

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
    throw error instanceof Error ? error : new Error(ERROR_MESSAGES.FAILED_TO_UPDATE_USER);
  }
};

export const deleteUser = (id: number): boolean => {
  try {
    const existingUser = getUserById(id);
    if (!existingUser) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

    const query = 'DELETE FROM users WHERE id = ?';
    const result = db.prepare(query).run(id);

    return result.changes > 0;
  } catch (error) {
    throw error instanceof Error ? error : new Error(ERROR_MESSAGES.FAILED_TO_DELETE_USER);
  }
};

export const getUserStats = (): DailyStats[] => {
  try {
    // Fixed to Africa/Kigali (UTC+02:00)
    const KIGALI_OFFSET_MINUTES = -120;
    const modifier = `${-KIGALI_OFFSET_MINUTES} minutes`;

    const sql = `
      WITH RECURSIVE days(d) AS (
        SELECT DATE('now','utc', ?, '-6 days')
        UNION ALL
        SELECT DATE(d, '+1 day') FROM days WHERE d < DATE('now','utc', ?)
      )
      SELECT d as date,
             COALESCE((
               SELECT COUNT(*) FROM users WHERE DATE(datetime(createdAt, ?)) = d
             ), 0) as count
      FROM days;
    `;

    const rows = db
      .prepare(sql)
      .all(modifier, modifier, modifier) as { date: string; count: number }[];

    return rows.map((r) => ({ date: r.date, count: r.count }));
  } catch (error) {
    throw new Error(ERROR_MESSAGES.FAILED_TO_FETCH_STATISTICS);
  }
};
