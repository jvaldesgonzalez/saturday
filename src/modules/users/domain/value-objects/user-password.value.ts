import { ValueObject } from 'src/shared/domain/value-object.abstract';
import { IGuardResult } from 'src/shared/core/interfaces/IGuardResult';
import { Guard } from 'src/shared/core/Guard';
import { Result } from 'src/shared/core/Result';
import * as bcrypt from 'bcrypt';

type UserPasswordProps = {
  value: string;
  isHashed: boolean;
};

export class UserPassword extends ValueObject<UserPasswordProps> {
  private readonly _brand?: void;
  public static minLength = 8;

  get value(): string {
    return this.props.value;
  }

  get isHashed(): boolean {
    return this.props.isHashed;
  }

  /**
   * Compares as plain-text and hashed password.
   *
   * @param {string} plainTextPassword
   * @returns  {Promise<boolean>}
   * @memberof UserPassword
   */
  async compareWith(plainTextPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, this.props.value);
  }

  private static async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 10);
  }

  private static isNotSimple(password: string): boolean {
    const re = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d].{8,}/;
    return re.test(password);
  }

  public static create({ value }: UserPasswordProps): Result<UserPassword> {
    const nullGuardResult: IGuardResult = Guard.againstNullOrUndefined(
      value,
      'password',
    );
    if (!nullGuardResult.succeeded) return Result.fail(nullGuardResult.message);

    const minGuardResult = Guard.againstAtLeast({
      numChars: this.minLength,
      argument: value,
      argumentPath: 'password',
    });
    if (!minGuardResult.succeeded) return Result.fail(minGuardResult.message);

    if (!this.isNotSimple(value))
      return Result.fail(`password: ${value} isn't complex`);
    return Result.ok(new UserPassword({ value, isHashed: false }));
  }

  public static async createFromPlain({
    value,
  }: UserPasswordProps): Promise<Result<UserPassword>> {
    const nullGuardResult: IGuardResult = Guard.againstNullOrUndefined(
      value,
      'password',
    );
    if (!nullGuardResult.succeeded) return Result.fail(nullGuardResult.message);

    const minGuardResult = Guard.againstAtLeast({
      numChars: this.minLength,
      argument: value,
      argumentPath: 'password',
    });
    if (!minGuardResult.succeeded) return Result.fail(minGuardResult.message);

    if (!this.isNotSimple(value))
      return Result.fail(`password: ${value} isn't complex`);

    value = await this.hashPassword(value);
    return Result.ok(new UserPassword({ value, isHashed: true }));
  }
}
