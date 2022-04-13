import { CreatePartnerDto } from 'src/modules/accounts-management/partners/application/dtos/create-partner.dto';

export type RegisterPartnerDto = Omit<
  CreatePartnerDto,
  'refreshToken' | 'username'
> & { username?: string };
