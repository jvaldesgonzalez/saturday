import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

type UserProfileImgProps = {
  value: string;
};

export class UserProfileImg extends ValueObject<UserProfileImgProps> {
  //TODO: Validate URL-type

  public get value(): string {
    return this.props.value;
  }

  public static create({ value }: UserProfileImgProps): Result<UserProfileImg> {
    return Result.Ok(new UserProfileImg({ value }));
  }
}
