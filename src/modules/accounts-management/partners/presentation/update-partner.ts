import { OmitType, PartialType } from '@nestjs/swagger';
import { RegisterPartnerRequest } from '../../auth/presentation/register-partner';

export class UpdatePartnerBody extends PartialType(
  OmitType(RegisterPartnerRequest, [
    'firebasePushId',
    'appVersion',
    'password',
  ]),
) {}
