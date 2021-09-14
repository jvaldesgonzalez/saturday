import { types } from 'neo4j-driver';
import { CommonAccount } from '../../domain/common-account.domain';
import { CommonAccountEntity } from '../entities/common-account.entity';

const { DateTime } = types;

export namespace CommonAccountMappers {
  export function toPersistence(domain: CommonAccount): CommonAccountEntity {
    return {
      id: domain._id.toString(),
      createdAt: DateTime.fromStandardDate(domain.createdAt),
      updatedAt: DateTime.fromStandardDate(domain.updatedAt),
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
