import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

export enum AuthProvider {
  Local = 'local',
  Facebook = 'facebook',
  Google = 'google',
}

type UserProviderProps = {
  value: AuthProvider;
};

export class UserProvider extends ValueObject<UserProviderProps> {
  get value(): AuthProvider {
    return this.props.value;
  }

  public static create({ value }: UserProviderProps): Result<UserProvider> {
    return Result.ok(new UserProvider({ value }));
  }
}
