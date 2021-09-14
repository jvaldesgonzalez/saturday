import { DateTime } from 'neo4j-driver';
import { CommonAccountEntity } from 'src/modules/accounts-management/common/infrastructure/entities/common-account.entity';

export class UserEntity extends CommonAccountEntity {
  fullname: string;
  birthday: DateTime<number>;
  gender: string;
  categoryPreferences: string[];
  locationId: string;
  authProviderId: string;
  authProvider: string;
}
