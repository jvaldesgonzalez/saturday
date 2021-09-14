import { types } from 'neo4j-driver';
import { CommonAccountMappers } from 'src/modules/accounts-management/common/infrastructure/mappers/common-account.mapper';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { User } from '../../domain/user.domain';
import { AuthProvider } from '../../domain/value-objects/auth-provider.value';
import { Gender } from '../../domain/value-objects/gender.value';
import { UserEntity } from '../entities/user.entity';

const { DateTime } = types;

export namespace UserMappers {
  export function toPersistence(domain: User): UserEntity {
    const common = CommonAccountMappers.toPersistence(domain);

    return {
      ...common,
      fullname: domain.fullname,
      birthday: DateTime.fromStandardDate(domain.birthday),
      gender: domain.gender,
      categoryPreferences: domain.categoryPreferences.map((p) => p.toString()),
      locationId: domain.locationId.toString(),
      authProviderId: domain.authProviderId.toString(),
      authProvider: domain.authProvider,
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
        createdAt: new Date(p.createdAt.toString()),
        updatedAt: new Date(p.updatedAt.toString()),
        birthday: new Date(p.birthday.toString()),
        gender: p.gender as Gender,
        authProvider: p.authProvider as AuthProvider,
        authProviderId,
      },
      new UniqueEntityID(p.id),
    ).getValue();
  }
}
