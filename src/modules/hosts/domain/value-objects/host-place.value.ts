import { Ok, Result } from 'src/shared/core/Result';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

type HostPlaceProps = {
  name: string;
  address: string;
  longitude: string;
  latitude: string;
};

export class HostPlace extends ValueObject<HostPlaceProps> {
  public get name(): string {
    return this.props.name;
  }

  public get address(): string {
    return this.props.address;
  }

  public get longitude(): string {
    return this.props.longitude;
  }

  public get latitude(): string {
    return this.props.latitude;
  }

  public static create(props: HostPlaceProps): Result<HostPlace> {
    return Ok(new HostPlace(props));
  }
}
