import { OmitType, PartialType } from '@nestjs/swagger';
import { RegisterBusinessRequest } from '../registerBusiness/request';

export class UpdateBusinessDetailsRequest extends PartialType(
  RegisterBusinessRequest,
) {}

export class UpdateBusinessDetailsBody extends OmitType(
  UpdateBusinessDetailsRequest,
  ['userId'] as const,
) {}
