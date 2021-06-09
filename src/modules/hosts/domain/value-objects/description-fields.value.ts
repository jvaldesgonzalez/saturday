import { Ok, Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

type DescriptionFieldProps = {
  header: string;
  body: string;
  inline: boolean;
};

export class DescriptionField extends ValueObject<DescriptionFieldProps> {
  public get header(): string {
    return this.props.header;
  }

  public get body(): string {
    return this.props.body;
  }

  public get isInline(): boolean {
    return this.props.inline;
  }

  public static create(props: DescriptionFieldProps): Result<DescriptionField> {
    return Ok(new DescriptionField(props));
  }
}
