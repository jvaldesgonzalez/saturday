import { Result } from 'src/shared/core/Result';
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
import { UserPassword } from '../../domain/value-objects/user-password.value';
import { Username } from '../../domain/value-objects/username.value';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  public static PersistentToDomain(p: UserEntity): User {
    const usernameOrError = Username.create(p.username);
    const emailOrError = UserEmail.create(p.email);
    const firebasePushIdOrError = FirebasePushId.create(p.firebasePushId);
    const appVersionOrError = Version.create(p.appVersion);
    const providerOrError = UserProvider.create(p.provider as AuthProvider);
    const passwordOrError = UserPassword.create({
      value: p.password,
      isHashed: true,
    });

    const combinedResult = Result.combine([
      usernameOrError,
      firebasePushIdOrError,
      providerOrError,
      appVersionOrError,
    ]);

    if (!combinedResult.isSuccess) throw combinedResult.errorValue();

    return User.create(
      {
        username: usernameOrError.getValue(),
        email: emailOrError.getValue(),
        firebasePushId: firebasePushIdOrError.getValue(),
        appVersion: appVersionOrError.getValue(),
        password: passwordOrError.getValue(),
        provider: providerOrError.getValue(),
        isActive: p.isActive,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        role: p.role as EnumRoles,
      },
      new UniqueEntityID(p.id),
    ).getValue();
  }

  public static async DomainToPersistent(d: User): Promise<UserEntity> {
    return {
      id: d._id.toString(),
      username: d.username.value,
      email: d.email.value,
      firebasePushId: d.firebasePushId.value,
      appVersion: d.appVersion.value,
      password: d.password
        ? d.password.isAlreadyHashed()
          ? d.password.value
          : await d.password.getHashedValue()
        : null,
      provider: d.provider.value,
      isActive: d.isActive,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
      role: d.role as string,
    };
  }
}
