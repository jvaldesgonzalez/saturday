import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';
import { IGuardResult } from 'src/shared/core/interfaces/IGuardResult';
import { Guard } from 'src/shared/core/Guard';

type BusinessNameProps = {
  value: string;
};

export class BusinessName extends ValueObject<BusinessNameProps> {
  private readonly _brand?: void;
  public static maxLength = 35;
  public static minLength = 2;

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): Result<BusinessName> {
    const nullGuardResult: IGuardResult = Guard.againstNullOrUndefined(
      value,
      'business name',
    );
    if (!nullGuardResult.succeeded) return Result.fail(nullGuardResult.message);
    const minGuardResult = Guard.againstAtLeast({
      numChars: this.minLength,
      argument: value,
      argumentPath: 'business name',
    });
    if (!minGuardResult.succeeded) return Result.fail(minGuardResult.message);
    const maxGuardResult = Guard.againstAtMost({
      numChars: this.maxLength,
      argument: value,
      argumentPath: 'business name',
    });
    if (!maxGuardResult.succeeded) return Result.fail(maxGuardResult.message);
    return Result.ok(new BusinessName({ value }));
  }
}
