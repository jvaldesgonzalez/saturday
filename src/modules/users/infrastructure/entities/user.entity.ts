import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class UserEntity extends PersistentEntity {
  username: string;
  email: string;
  firebasePushId: string;
  appVersion: number;
  password: string;
  role: string;
  provider: string;
  isActive: boolean;
}
