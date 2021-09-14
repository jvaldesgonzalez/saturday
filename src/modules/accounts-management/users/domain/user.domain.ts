import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import {
  CommonAccount,
  CommonAccountProps,
} from '../../common/domain/common-account.domain';
import { AuthProviderId } from './value-objects/auth-provider-id.value';
import { AuthProvider } from './value-objects/auth-provider.value';
import { CategoryId } from './value-objects/category-id.value';
import { Gender } from './value-objects/gender.value';
import { LocationId } from './value-objects/location-id.value';

type UserProps = {
  fullname: string;
  birthday: Date;
  gender: Gender;

  categoryPreferences: CategoryId[];
  locationId: LocationId;

  //a unique identifier of the provider,
  //THE PROCESS
  //the app sends a token that the provider
  //understands, then I access to the user info
  //by the provider API. In the info i would catch
  //a unique ID, then in login process I will verify
  //that the token sended by app contains the user
  //that has the providerUid in database
  authProviderId: AuthProviderId;
  authProvider: AuthProvider;
} & CommonAccountProps;

type NewUserProps = Omit<UserProps, 'createdAt' | 'updatedAt'>;

export class User extends CommonAccount<UserProps> {
  get fullname(): string {
    return this.props.fullname;
  }

  get birthday(): Date {
    return this.props.birthday;
  }

  get gender(): Gender {
    return this.props.gender;
  }

  get categoryPreferences(): CategoryId[] {
    return this.props.categoryPreferences;
  }

  get locationId(): LocationId {
    return this.props.locationId;
  }

  get authProviderId(): AuthProviderId {
    return this.props.authProviderId;
  }

  get authProvider(): AuthProvider {
    return this.props.authProvider;
  }

  public static new(props: NewUserProps): Result<User> {
    return User.create(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID(),
    );
  }

  public static create(props: UserProps, id: UniqueEntityID): Result<User> {
    return Ok(new User(props, id));
  }
}
