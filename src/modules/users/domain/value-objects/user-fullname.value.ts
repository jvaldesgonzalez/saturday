import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';
import { IGuardResult } from 'src/shared/core/interfaces/IGuardResult';
import { Guard } from 'src/shared/core/Guard';
import { AppError } from 'src/shared/core/errors/AppError';

type UserFullnameProps = {
  value: string;
};

export class UserFullname extends ValueObject<UserFullnameProps> {
  private readonly _brand?: void;
  public static maxLength = 35;
  public static minLength = 2;

  get value(): string {
    return this.props.value;
  }

  public static create({ value }: UserFullnameProps): Result<UserFullname> {
    const nullGuardResult: IGuardResult = Guard.againstNullOrUndefined(
      value,
      'lastname',
    );
    if (!nullGuardResult.succeeded)
      return Result.Fail(new AppError.ValidationError(nullGuardResult.message));
    const minGuardResult = Guard.againstAtLeast({
      numChars: this.minLength,
      argument: value,
      argumentPath: 'lastname',
    });
    if (!minGuardResult.succeeded)
      return Result.Fail(new AppError.ValidationError(minGuardResult.message));
    const maxGuardResult = Guard.againstAtMost({
      numChars: this.maxLength,
      argument: value,
      argumentPath: 'lastname',
    });
    if (!maxGuardResult.succeeded)
      return Result.Fail(new AppError.ValidationError(maxGuardResult.message));
    return Result.Ok(new UserFullname({ value }));
  }
}
