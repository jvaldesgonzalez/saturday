import { Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

type HostProfileImgProps = {
  value: string;
};

export class HostProfileImg extends ValueObject<HostProfileImgProps> {
  //TODO: Validate URL-type

  public get value(): string {
    return this.props.value;
  }

  public static create(value: string): Result<HostProfileImg> {
    return Result.ok(new HostProfileImg({ value }));
  }
}
