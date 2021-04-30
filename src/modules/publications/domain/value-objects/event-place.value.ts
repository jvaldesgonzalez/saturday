import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { ValueObject } from 'src/shared/domain/value-object.abstract';

type HostRef = UniqueEntityID;

type EventPlaceProps = {
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  hostRef?: HostRef;
};

export class EventPlace extends ValueObject<EventPlaceProps> {
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

  public get hostRef(): HostRef {
    return this.props.hostRef;
  }

  public static create(props: EventPlaceProps): Result<EventPlace> {
    return Ok(new EventPlace(props));
  }
}
