import { CommonAccountEntity } from 'src/modules/accounts-management/common/infrastructure/entities/common-account.entity';

class PartnerPlace {
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  locationId: string;
}

export class PartnerEntity extends CommonAccountEntity {
  businessName: string;
  phoneNumber: string;
  aditionalBusinessData: string;
  place?: PartnerPlace;
  password: string;
  isVerified: boolean;
}
