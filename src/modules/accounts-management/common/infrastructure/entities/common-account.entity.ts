import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class CommonAccountEntity extends PersistentEntity {
  username: string;
  email: string;
  firebasePushId: string;
  appVersion: number;
  isActive: boolean;
  avatar: string;
  refreshToken: string;
}
