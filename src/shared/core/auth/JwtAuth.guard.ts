import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const httpCtx = context.switchToHttp();
    const req = httpCtx.getRequest();
    if (!req.headers.authorization) throw new UnauthorizedException();
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throw new UnauthorizedException();
    try {
      const payload = jwt.verify(token, 'test-secret') as JWTClaims;
      req.payload = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
