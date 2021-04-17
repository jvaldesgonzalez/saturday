import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class UserEntity extends PersistentEntity {
  fullname: string;
  username: string;
  email: string;
  profileImageUrl: string;
  firebasePushId: string;
  appVersion: number;
  password: string;
  role: number;
  provider: string;
  isActive: boolean;
}
