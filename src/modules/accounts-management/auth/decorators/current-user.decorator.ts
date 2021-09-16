import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTClaim } from '../login-payload.type';

export const CurrentUser = createParamDecorator(
  (_data: never, ctx: ExecutionContext): JWTClaim =>
    ctx.switchToHttp().getRequest().payload,
);
