import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { Version } from 'src/shared/domain/version.value-object';
import { UserProvider } from '../value-objects/user-auth-provider.value';
import { UserEmail } from '../value-objects/user-email.value';
import { FirebasePushId } from '../value-objects/user-firebase-push-id.value';
import { UserFullname } from '../value-objects/user-fullname.value';
import { UserPassword } from '../value-objects/user-password.value';
import { UserProfileImg } from '../value-objects/user-profile-img.value';
import { Username } from '../value-objects/username.value';
import { Result } from 'src/shared/core/Result';
import { JWTClaims, JWTToken } from '../value-objects/token.value';
import { EnumRoles } from 'src/shared/domain/roles.enum';
import * as jwt from 'jsonwebtoken';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Guard, GuardArgumentCollection } from 'src/shared/core/Guard';

type UserProps = {
  fullname: UserFullname;
  username: Username;
  profileImageUrl: UserProfileImg;
  email: UserEmail;
  firebasePushId: FirebasePushId;
  appVersion: Version;
  password?: UserPassword;
  provider: UserProvider;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: EnumRoles;
};

type NewUserProps = Omit<UserProps, 'createdAt' | 'updatedAt' | 'isActive'>;

export class User extends DomainEntity<UserProps> {
  private readonly __brand: void;

  public get firebasePushId(): FirebasePushId {
    return this.props.firebasePushId;
  }

  public get profileImageUrl(): UserProfileImg {
    return this.props.profileImageUrl;
  }

  public get appVersion(): Version {
    return this.props.appVersion;
  }

  public get provider(): UserProvider {
    return this.props.provider;
  }

  public get fullname(): UserFullname {
    return this.props.fullname;
  }

  public get username(): UserFullname {
    return this.props.username;
  }

  public get email(): UserEmail {
    return this.props.email;
  }

  public get password(): UserPassword {
    if (this.props.password) return this.props.password;
    return undefined;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get role(): EnumRoles {
    return this.props.role;
  }

  changeEmail(newEmail: UserEmail): void {
    this.props.email = newEmail;
    this.props.updatedAt = new Date();
  }

  changeUsername(newUsername: Username): void {
    this.props.username = newUsername;
    this.props.updatedAt = new Date();
  }

  changeFullname(newFullname: UserFullname): void {
    this.props.fullname = newFullname;
    this.props.updatedAt = new Date();
  }

  changeProfileImage(newImage: UserProfileImg): void {
    this.props.fullname = newImage;
    this.props.updatedAt = new Date();
  }

  changePassword(newPassword: UserPassword): void {
    this.props.password = newPassword;
    this.props.updatedAt = new Date();
  }

  resetPassword(newPassword: UserPassword): void {
    this.props.password = newPassword;
    this.props.updatedAt = new Date();
  }

  markDeleted(): void {
    this.props.updatedAt = new Date();
    this.props.isActive = false;
  }

  getUserToken(): JWTToken {
    const jwtClaims: JWTClaims = {
      id: this._id.toString(),
      role: this.role,
      email: this.email.value,
      username: this.username.value,
    };
    //TODO: Put secret in a config module (AKA Make a config module XD)
    const token = jwt.sign(jwtClaims, process.env.JWT_SECRET ?? 'test-secret', {
      expiresIn: process.env.JWT_EXPIRATION ?? 86400,
    });
    return token;
  }

  public static new(props: NewUserProps): Result<User> {
    return this.create(
      {
        ...props,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID(),
    );
  }

  public static create(props: UserProps, id: UniqueEntityID): Result<User> {
    const args: GuardArgumentCollection = [
      { argument: props.username, argumentPath: 'username' },
      { argument: props.fullname, argumentPath: 'fullname' },
      { argument: props.email, argumentPath: 'email' },
      { argument: props.role, argumentPath: 'role' },
      { argument: props.createdAt, argumentPath: 'createdAt' },
      { argument: props.updatedAt, argumentPath: 'updatedAt' },
      {
        argument: props.profileImageUrl,
        argumentPath: 'profileImageUrl',
      },
    ];
    const nullGuard = Guard.againstNullOrUndefinedBulk(args);
    if (!nullGuard.succeeded) return Result.fail(nullGuard.message);
    return Result.ok(new User(props, id));
  }
}
