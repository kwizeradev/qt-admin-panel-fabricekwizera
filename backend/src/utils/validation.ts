import { USER_ROLES, USER_STATUS } from '../constants';

export const isValidRole = (role: string): boolean => {
  return (USER_ROLES as readonly string[]).includes(role);
};

export const isValidStatus = (status: string): boolean => {
  return (USER_STATUS as readonly string[]).includes(status);
};

export const isValidId = (id: string): number | null => {
  const parsedId = parseInt(id, 10);
  return isNaN(parsedId) ? null : parsedId;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeTzOffset = (raw: unknown): number => {
  const n = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
  if (!Number.isFinite(n)) return 0;
  const t = Math.trunc(n);
  const MIN = -14 * 60; // UTC-14:00
  const MAX = 14 * 60;  // UTC+14:00
  return Math.min(MAX, Math.max(MIN, t));
};

