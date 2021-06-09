import { Guard } from '../core/Guard';
import { Fail, Ok, Result } from '../core/Result';
import { ValueObject } from './value-object.abstract';

export type MultimediaType = 'image' | 'video';

type MultimediaProps = {
  type: MultimediaType;
  url: string;
};

export class Multimedia extends ValueObject<MultimediaProps> {
  get type(): MultimediaType {
    return this.props.type;
  }

  get url(): string {
    return this.props.url;
  }

  public static create(props: MultimediaProps): Result<Multimedia> {
    const againstNil = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.type,
        argumentPath: 'type',
      },
      {
        argument: props.url,
        argumentPath: 'url',
      },
    ]);
    if (!againstNil.succeeded) return Fail(againstNil.message);
    return Ok(new Multimedia(props));
  }
}
