import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

type FirebasePushIdProps = {
  value: string;
};

export class FirebasePushId extends ValueObject<FirebasePushIdProps> {
  get value(): string {
    return this.props.value;
  }

  public static create(value: string): Result<FirebasePushId> {
    return Result.ok(new FirebasePushId({ value }));
  }
}
