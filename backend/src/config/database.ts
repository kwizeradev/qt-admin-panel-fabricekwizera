import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(__dirname, '../../db');
const DB_PATH = path.join(DB_DIR, 'users.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

db.pragma('foreign_keys = ON');

const createUsersTable = (): void => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL CHECK(role IN ('admin', 'user', 'guest')),
      status TEXT NOT NULL CHECK(status IN ('active', 'inactive')),
      createdAt TEXT NOT NULL,
      signature TEXT NOT NULL
    )
  `;

  db.exec(query);
  console.log('Users table ready');
};

export const initializeDatabase = (): void => {
  try {
    createUsersTable();
    console.log('Database initialized successfully ');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export default db;