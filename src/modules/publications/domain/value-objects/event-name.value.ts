import { Guard } from 'src/shared/core/Guard';
import { Ok, Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

type EventNameProps = {
  value: string;
};

export class EventName extends ValueObject<EventNameProps> {
  private readonly __brand: void;
  public static minLength = 4;

  public get value(): string {
    return this.props.value;
  }

  public static create(value: string): Result<EventName> {
    const nullGuardResult = Guard.againstNullOrUndefined(value, 'name');
    if (!nullGuardResult.succeeded) return Result.fail(nullGuardResult.message);
    const minGuardResult = Guard.againstAtLeast({
      numChars: this.minLength,
      argument: value,
      argumentPath: 'name',
    });
    if (!minGuardResult.succeeded) return Result.fail(minGuardResult.message);

    return Ok(new EventName({ value }));
  }
}
