import { CreateAccountDto } from 'src/modules/accounts-management/common/application/dto/create-account.dto';
import { PartnerDescription } from '../../domain/value-objects/partner-description.value';
import { PartnerPlace } from '../../domain/value-objects/partner-place.value';

export type CreatePartnerDto = {
  businessName: string;
  phoneNumber: string;
  aditionalBusinessData: PartnerDescription;
  place?: PartnerPlace;
  refreshToken: string;
  password: string;
} & CreateAccountDto;
