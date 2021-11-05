import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTClaim } from '../login-payload.type';

export const CurrentUser = createParamDecorator(
  (_data: never, ctx: ExecutionContext): JWTClaim => {
    return {
      id: '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
      email: 'blabla@gmail.com',
      username: 'yarn_rp',
    };
  },
);
