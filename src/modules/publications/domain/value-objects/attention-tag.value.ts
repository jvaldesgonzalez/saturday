import { Ok, Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

type RGBAColor = string;

type AttentionTagProps = {
  preview: string;
  color: RGBAColor;
  description: string;
};

export class AttentionTag extends ValueObject<AttentionTagProps> {
  public get preview(): string {
    return this.props.preview;
  }

  public get color(): RGBAColor {
    return this.props.color;
  }

  public get description(): string {
    return this.props.description;
  }

  public create(props: AttentionTagProps): Result<AttentionTag> {
    return Ok(new AttentionTag(props));
  }
}
