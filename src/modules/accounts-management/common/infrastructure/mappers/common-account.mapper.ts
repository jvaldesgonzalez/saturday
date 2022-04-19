import { makeDate } from 'src/shared/modules/data-access/neo4j/utils';
import { CommonAccount } from '../../domain/common-account.domain';
import { CommonAccountEntity } from '../entities/common-account.entity';

export namespace CommonAccountMappers {
  export function toPersistence(domain: CommonAccount): CommonAccountEntity {
    return {
      id: domain._id.toString(),
      createdAt: makeDate(domain.createdAt),
      updatedAt: makeDate(domain.updatedAt),
      username: domain.username,
      email: domain.email,
      firebasePushId: domain.firebasePushId,
      appVersion: domain.appVersion,
      isActive: domain.isActive,
      avatar: domain.avatar,
      refreshToken: domain.refreshToken,
    };
  }
}
