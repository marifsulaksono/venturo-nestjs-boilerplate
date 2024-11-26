import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Roles = (roles: string) => SetMetadata('requiredRoles', roles);

export const LIMIT_KEY = 'rate_limit';
export const Limit = (maxRequests: number, windowSeconds: number) => {
  return SetMetadata(LIMIT_KEY, { maxRequests, windowSeconds });
};
