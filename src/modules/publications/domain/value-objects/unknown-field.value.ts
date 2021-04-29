import { Ok, Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

type UnknownFieldProps = {
  header: string;
  body: string;
  inline: boolean;
};

export class UnknownField extends ValueObject<UnknownFieldProps> {
  public get header(): string {
    return this.props.header;
  }

  public get body(): string {
    return this.props.body;
  }

  public get isInline(): boolean {
    return this.props.inline;
  }

  public static create(props: UnknownFieldProps): Result<UnknownField> {
    return Ok(new UnknownField(props));
  }
}
