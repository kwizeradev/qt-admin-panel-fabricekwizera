export const USER_ROLES = ['admin', 'user', 'guest'] as const;
export const USER_STATUS = ['active', 'inactive'] as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  INVALID_USER_ID: 'Invalid user ID',
  USER_NOT_FOUND: 'User not found',
  MISSING_REQUIRED_FIELDS: 'Missing required fields: email, role, status',
  INVALID_ROLE: 'Invalid role. Must be: admin, user, or guest',
  INVALID_STATUS: 'Invalid status. Must be: active or inactive',
  FAILED_TO_FETCH_USERS: 'Failed to fetch users',
  FAILED_TO_FETCH_USER: 'Failed to fetch user',
  FAILED_TO_CREATE_USER: 'Failed to create user',
  FAILED_TO_UPDATE_USER: 'Failed to update user',
  FAILED_TO_DELETE_USER: 'Failed to delete user',
  FAILED_TO_EXPORT_USERS: 'Failed to export users',
  FAILED_TO_FETCH_STATISTICS: 'Failed to fetch statistics',
  FAILED_TO_RETRIEVE_PUBLIC_KEY: 'Failed to retrieve public key',
} as const;