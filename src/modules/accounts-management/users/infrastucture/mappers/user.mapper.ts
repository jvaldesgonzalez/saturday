import { CommonAccountMappers } from 'src/modules/accounts-management/common/infrastructure/mappers/common-account.mapper';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import {
  makeDate,
  parseDate,
} from 'src/shared/modules/data-access/neo4j/utils';
import { User } from '../../domain/user.domain';
import { AuthProvider } from '../../domain/value-objects/auth-provider.value';
import { Gender } from '../../domain/value-objects/gender.value';
import { UserEntity } from '../entities/user.entity';

export namespace UserMappers {
  export function toPersistence(domain: User): UserEntity {
    const common = CommonAccountMappers.toPersistence(domain);

    return {
      ...common,
      fullname: domain.fullname,
      description: domain.description,
      birthday: domain.birthday ? makeDate(domain.birthday) : null,
      gender: domain.gender ? domain.gender : null,
      categoryPreferences: domain.categoryPreferences.map((p) => p.toString()),
      locationId: domain.locationId.toString(),
      authProviderId: domain.authProviderId.toString(),
      authProvider: domain.authProvider,
      privacyStatus: domain.privacyStatus,
    };
  }

  export function fromPersistence(p: UserEntity): User {
    const locationId = new UniqueEntityID(p.locationId);
    const categoryPreferences = p.categoryPreferences.map(
      (c) => new UniqueEntityID(c),
    );
    const authProviderId = new UniqueEntityID(p.authProviderId);

    return User.create(
      {
        ...p,
        locationId,
        categoryPreferences,
        createdAt: parseDate(p.createdAt),
        updatedAt: parseDate(p.updatedAt),
        birthday: p.birthday ? parseDate(p.birthday) : null,
        gender: p.gender ? (p.gender as Gender) : null,
        authProvider: p.authProvider as AuthProvider,
        authProviderId,
        privacyStatus: p.privacyStatus,
      },
      new UniqueEntityID(p.id),
    ).getValue();
  }
}
