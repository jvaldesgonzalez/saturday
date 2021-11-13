import { Request } from 'express';
import { JWTClaim } from 'src/modules/accounts-management/auth/login-payload.type';

export class RequestWithPayload extends Request {
  payload: JWTClaim;
}
