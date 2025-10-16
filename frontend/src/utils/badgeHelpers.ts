import { UserRole, UserStatus, BadgeVariant } from '../types/enums';
import type { UserRole as UserRoleType, UserStatus as UserStatusType, BadgeVariant as BadgeVariantType } from '../types/enums';

export const getRoleBadgeVariant = (role: UserRoleType): BadgeVariantType => {
  switch (role) {
    case UserRole.ADMIN: return BadgeVariant.ERROR;
    case UserRole.USER: return BadgeVariant.INFO;
    case UserRole.GUEST: return BadgeVariant.DEFAULT;
    default: return BadgeVariant.DEFAULT;
  }
};

export const getStatusBadgeVariant = (status: UserStatusType): BadgeVariantType => {
  return status === UserStatus.ACTIVE ? BadgeVariant.SUCCESS : BadgeVariant.DEFAULT;
};