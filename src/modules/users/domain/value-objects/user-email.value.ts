import { ValueObject } from 'src/shared/domain/value-object.abstract';
import { IGuardResult } from 'src/shared/core/interfaces/IGuardResult';
import { Guard } from 'src/shared/core/Guard';
import { Result } from 'src/shared/core/Result';

type UserEmailProps = {
  value: string;
};

export class UserEmail extends ValueObject<UserEmailProps> {
  private readonly __brand?: void;

  get value(): string {
    return this.props.value;
  }

  private static isValidEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }

  public static create({ value }: UserEmailProps): Result<UserEmail> {
    const nullGuardResult: IGuardResult = Guard.againstNullOrUndefined(
      value,
      'email',
    );
    if (!nullGuardResult.succeeded) return Result.fail(nullGuardResult.message);
    if (!this.isValidEmail(value))
      return Result.fail(`email: ${value} isn't valid`);
    return Result.ok(new UserEmail({ value: this.format(value) }));
  }
}
