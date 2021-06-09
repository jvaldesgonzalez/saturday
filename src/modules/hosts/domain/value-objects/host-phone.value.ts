import { isPhoneNumber } from 'class-validator';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

type HostPhoneProps = {
  value: string;
};

export class HostPhone extends ValueObject<HostPhoneProps> {
  private readonly __brand?: void;

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): Result<HostPhone> {
    const guardIsPhone = isPhoneNumber(value);
    if (!guardIsPhone) return Fail('Not a valid phone number');
    return Ok(new HostPhone({ value }));
  }
}
