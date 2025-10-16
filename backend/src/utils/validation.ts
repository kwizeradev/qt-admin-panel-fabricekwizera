export const isValidRole = (role: string): boolean => {
  return ['admin', 'user', 'guest'].includes(role);
};

export const isValidStatus = (status: string): boolean => {
  return ['active', 'inactive'].includes(status);
};

export const isValidId = (id: string): number | null => {
  const parsedId = parseInt(id, 10);
  return isNaN(parsedId) ? null : parsedId;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};