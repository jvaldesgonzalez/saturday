import { DateTime } from 'neo4j-driver';
import { CommonAccountEntity } from 'src/modules/accounts-management/common/infrastructure/entities/common-account.entity';
import { PrivacyStatus } from '../../domain/value-objects/privacy-status.value';

export class UserEntity extends CommonAccountEntity {
  fullname: string;
  description: string;
  birthday: DateTime<number>;
  gender: string;
  categoryPreferences: string[];
  locationId: string;
  authProviderId: string;
  authProvider: string;
  privacyStatus: PrivacyStatus;
}
