import { AppError } from 'src/shared/core/errors/AppError';
import { Guard } from 'src/shared/core/Guard';
import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

type UsernameProps = {
  value: string;
};

export class Username extends ValueObject<UsernameProps> {
  private readonly __brand: void;
  public static minLength = 4;

  public get value(): string {
    return this.props.value;
  }

  public static create({ value }: UsernameProps): Result<Username> {
    const nullGuardResult = Guard.againstNullOrUndefined(value, 'name');
    if (!nullGuardResult.succeeded)
      return Result.Fail(new AppError.ValidationError(nullGuardResult.message));
    const minGuardResult = Guard.againstAtLeast({
      numChars: this.minLength,
      argument: value,
      argumentPath: 'name',
    });
    if (!minGuardResult.succeeded)
      return Result.Fail(new AppError.ValidationError(minGuardResult.message));

    return Result.Ok(new Username({ value }));
  }
}
