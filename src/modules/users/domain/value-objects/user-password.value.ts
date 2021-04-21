import { ValueObject } from 'src/shared/domain/value-object.abstract';
import { Guard } from 'src/shared/core/Guard';
import { Result } from 'src/shared/core/Result';
import * as bcrypt from 'bcrypt';

type UserPasswordProps = {
  value: string;
  isHashed?: boolean;
};

export class UserPassword extends ValueObject<UserPasswordProps> {
  private readonly _brand?: void;
  public static minLength = 8;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserPasswordProps) {
    super(props);
  }

  private static isAppropriateLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  /**
   * @method comparePassword
   * @desc Compares as plain-text and hashed password.
   */

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;
    if (this.isAlreadyHashed()) {
      hashed = this.props.value;
      return this.bcryptCompare(plainTextPassword, hashed);
    } else {
      return this.props.value === plainTextPassword;
    }
  }

  private bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
    return new Promise((resolve) => {
      bcrypt.compare(plainText, hashed, (err, compareResult) => {
        if (err) return resolve(false);
        return resolve(compareResult);
      });
    });
  }

  public isAlreadyHashed(): boolean {
    return this.props.isHashed;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async getHashedValue(): Promise<string> {
    if (this.isAlreadyHashed()) return this.props.value;
    return await this.hashPassword(this.props.value);
  }

  public static create(props: UserPasswordProps): Result<UserPassword> {
    const propsResult = Guard.againstNullOrUndefined(props.value, 'password');

    if (!propsResult.succeeded) {
      return Result.fail<UserPassword>(propsResult.message);
    } else {
      if (!props.isHashed) {
        if (!this.isAppropriateLength(props.value)) {
          return Result.fail<UserPassword>(
            'Password doesnt meet criteria [8 chars min].',
          );
        }
      }

      return Result.ok<UserPassword>(
        new UserPassword({
          value: props.value,
          isHashed: !!props.isHashed === true,
        }),
      );
    }
  }
}
