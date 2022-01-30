import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EnumRoles } from 'src/shared/domain/roles.enum';
import { ROLES_KEY } from '../decorators/role.decorator';
import { JWTClaim } from '../login-payload.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<EnumRoles>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const payload: JWTClaim = context.switchToHttp().getRequest().payload;
    return requiredRoles === payload.role;
  }
}
