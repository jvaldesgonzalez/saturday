import { CreatePartnerDto } from './create-partner.dto';

export type UpdatePartnerDto = Partial<
  Omit<
    CreatePartnerDto,
    'password' | 'refreshToken' | 'firebasePushId' | 'appVersion'
  >
> & { id: string };
