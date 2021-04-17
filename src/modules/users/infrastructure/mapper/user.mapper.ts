import Optional from 'src/shared/core/Option';
import { EnumRoles } from 'src/shared/domain/roles.enum';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Version } from 'src/shared/domain/version.value-object';
import { User } from '../../domain/entities/user.entity';
import {
  AuthProvider,
  UserProvider,
} from '../../domain/value-objects/user-auth-provider.value';
import { UserEmail } from '../../domain/value-objects/user-email.value';
import { FirebasePushId } from '../../domain/value-objects/user-firebase-push-id.value';
import { UserFullname } from '../../domain/value-objects/user-fullname.value';
import { UserPassword } from '../../domain/value-objects/user-password.value';
import { UserProfileImg } from '../../domain/value-objects/user-profile-img.value';
import { Username } from '../../domain/value-objects/username.value';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  public static PersistentToDomain(p: UserEntity): User {
    const fullnameOrError = UserFullname.create({ value: p.fullname });
    const usernameOrError = Username.create({ value: p.username });
    const profileImageUrlOrError = UserProfileImg.create({
      value: p.profileImageUrl,
    });
    const emailOrError = UserEmail.create({ value: p.email });
    const firebasePushIdOrError = FirebasePushId.create({
      value: p.firebasePushId,
    });
    const appVersionOrError = Version.create({ value: p.appVersion });
    const providerOrError = UserProvider.create({
      value: p.provider as AuthProvider,
    });
    const passwordOrNone: Optional<UserPassword> = p.password
      ? Optional(UserPassword.create({ value: p.password, isHashed: true }))
      : Optional(null);

    const combinedResult = fullnameOrError
      .and(usernameOrError)
      .and(profileImageUrlOrError)
      .and(firebasePushIdOrError)
      .and(providerOrError)
      .and(appVersionOrError);

    if (!combinedResult.isSuccess) combinedResult.unwrapError().throw();

    return User.create(
      {
        fullname: fullnameOrError.unwrap(),
        username: usernameOrError.unwrap(),
        profileImageUrl: profileImageUrlOrError.unwrap(),
        email: emailOrError.unwrap(),
        firebasePushId: firebasePushIdOrError.unwrap(),
        appVersion: appVersionOrError.unwrap(),
        password: passwordOrNone,
        provider: providerOrError.unwrap(),
        isActive: p.isActive,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        role: p.role as EnumRoles,
      },
      new UniqueEntityID(p.id),
    ).unwrap();
  }

  public static DomainToPersistent(d: User): UserEntity {
    return {
      id: d._id.toString(),
      fullname: d.fullname.value,
      username: d.username.value,
      profileImageUrl: d.profileImageUrl.value,
      email: d.email.value,
      firebasePushId: d.firebasePushId.value,
      appVersion: d.appVersion.value,
      password: d.password.mapOr(null, (pass) => pass.value),
      provider: d.provider.value,
      isActive: d.isActive,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
      role: d.role as number,
    };
  }
}
