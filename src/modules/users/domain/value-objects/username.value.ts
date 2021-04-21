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

  public static create(value: string): Result<Username> {
    const nullGuardResult = Guard.againstNullOrUndefined(value, 'name');
    if (!nullGuardResult.succeeded) return Result.fail(nullGuardResult.message);
    const minGuardResult = Guard.againstAtLeast({
      numChars: this.minLength,
      argument: value,
      argumentPath: 'name',
    });
    if (!minGuardResult.succeeded) return Result.fail(minGuardResult.message);

    return Result.ok(new Username({ value }));
  }
}
