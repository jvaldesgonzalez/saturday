import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';
import { IGuardResult } from 'src/shared/core/interfaces/IGuardResult';
import { Guard } from 'src/shared/core/Guard';

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
    if (!nullGuardResult.succeeded) return Result.fail(nullGuardResult.message);
    const minGuardResult = Guard.againstAtLeast({
      numChars: this.minLength,
      argument: value,
      argumentPath: 'lastname',
    });
    if (!minGuardResult.succeeded) return Result.fail(minGuardResult.message);
    const maxGuardResult = Guard.againstAtMost({
      numChars: this.maxLength,
      argument: value,
      argumentPath: 'lastname',
    });
    if (!maxGuardResult.succeeded) return Result.fail(maxGuardResult.message);
    return Result.ok(new UserFullname({ value }));
  }
}
