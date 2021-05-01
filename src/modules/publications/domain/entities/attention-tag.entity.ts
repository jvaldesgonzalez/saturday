import { Ok, Result } from 'src/shared/core/Result';
import { DomainEntity } from 'src/shared/domain/entity.abstract';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

type RGBAColor = string;

type AttentionTagProps = {
  title: string;
  color: RGBAColor;
  description: string;
};

export class AttentionTag extends DomainEntity<AttentionTagProps> {
  public get title(): string {
    return this.props.title;
  }

  public get color(): RGBAColor {
    return this.props.color;
  }

  public get description(): string {
    return this.props.description;
  }

  public static create(props: AttentionTagProps): Result<AttentionTag> {
    return Ok(new AttentionTag(props, new UniqueEntityID()));
  }
}
