import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): JWTClaims =>
    ctx.switchToHttp().getRequest().payload,
);
