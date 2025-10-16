export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
} as const;

export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
} as const;

export const BadgeVariant = {
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success',
  DEFAULT: 'default'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
export type UserStatus = typeof UserStatus[keyof typeof UserStatus];
export type BadgeVariant = typeof BadgeVariant[keyof typeof BadgeVariant];