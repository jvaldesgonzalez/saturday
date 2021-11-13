import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/skip-auth.decorator';
import { JWTUtils } from '../jwt-utils';
import { JWTClaim } from '../login-payload.type';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const httpCtx = context.switchToHttp();
    const req = httpCtx.getRequest();
    if (req.route.path === '/metrics') return true;
    if (!req.headers.authorization) throw new UnauthorizedException();
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throw new UnauthorizedException();
    try {
      const payload = JWTUtils.decode(token) as JWTClaim;
      req.payload = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
