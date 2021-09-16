import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JWTUtils } from '../jwt-utils';
import { JWTClaim } from '../login-payload.type';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const httpCtx = context.switchToHttp();
    const req = httpCtx.getRequest();
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
