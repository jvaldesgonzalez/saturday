import { SetMetadata } from '@nestjs/common';
import { EnumRoles } from 'src/shared/domain/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (role: EnumRoles) => SetMetadata(ROLES_KEY, role);
