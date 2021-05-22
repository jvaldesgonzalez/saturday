import { Guard } from 'src/shared/core/Guard';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

type TicketAmountProps = {
  value: number;
};

export class TicketAmount extends ValueObject<TicketAmountProps> {
  public static readonly MIN_PRICE = 0;

  get value(): number {
    return this.props.value;
  }

  public static create(value: number): Result<TicketAmount> {
    const againstAtLeast = Guard.inRange({
      argumentPath: 'amount',
      max: Infinity,
      min: this.MIN_PRICE,
      num: value,
    });
    if (!againstAtLeast.succeeded) return Fail(againstAtLeast.message);

    return Ok(new TicketAmount({ value }));
  }
}
