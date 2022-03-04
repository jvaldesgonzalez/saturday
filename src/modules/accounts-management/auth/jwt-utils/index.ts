import { JWTClaim, JWTToken } from '../login-payload.type';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../constants/jwt-secrets';
import crypto from 'crypto';

export namespace JWTUtils {
  export function sign(claim: JWTClaim) {
    return jwt.sign(claim, jwtSecret, { expiresIn: '10s' });
  }

  export function decode(token: JWTToken): JWTClaim {
    return jwt.verify(token, jwtSecret) as JWTClaim;
  }

  export function signRefresh() {
    return crypto.randomBytes(40).toString('hex');
  }
}
