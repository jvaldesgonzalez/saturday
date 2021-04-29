import { Guard } from 'src/shared/core/Guard';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

type TicketPriceProps = {
  value: number;
};

export class TicketPrice extends ValueObject<TicketPriceProps> {
  public static readonly MIN_PRICE = 0;

  get value(): number {
    return this.props.value;
  }

  public static create(value: number): Result<TicketPrice> {
    const againstAtLeast = Guard.inRange({
      argumentPath: 'price',
      max: Infinity,
      min: this.MIN_PRICE,
      num: value,
    });
    if (!againstAtLeast.succeeded) return Fail(againstAtLeast.message);
    return Ok(new TicketPrice({ value }));
  }
}
