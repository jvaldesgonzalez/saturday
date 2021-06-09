import { Join, Ok } from 'src/shared/core/Result';
import { Host } from '../../domain/entities/host.entity';
import { UserRef } from '../../domain/entities/userRef.entity';
import { DescriptionField } from '../../domain/value-objects/description-fields.value';
import { HostPlace } from '../../domain/value-objects/host-place.value';
import { DescriptionFieldRaw, HostEntity } from '../entities/host.entity';

export class HostMapper {
  public static PersistentToDomain(p: HostEntity): Host {
    const userRefOrError = UserRef.create(p.id);
    const descOrError = DescriptionField.create(
      JSON.parse(p.businessDescription),
    );
    const aditionalDataOrError = Join(
      (JSON.parse(
        p.aditionalBusinessData,
      ) as DescriptionFieldRaw[]).map((data) => DescriptionField.create(data)),
    );
    const placeOrError = p.place ? HostPlace.create(p.place) : Ok(undefined);

    return Host.create({
      userRef: userRefOrError.getValue(),
      businessDescription: descOrError.getValue(),
      aditionalBusinessData: aditionalDataOrError.getValue(),
      place: placeOrError.getValue(),
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }).getValue();
  }

  public static DomainToPersistent(d: Host): HostEntity {
    return {
      id: d._id.toString(),
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
      businessDescription: JSON.stringify(d.businessDescription),
      aditionalBusinessData: JSON.stringify(d.aditionalBusinessData),
      place: d.place
        ? {
            name: d.place.name,
            address: d.place.address,
            longitude: d.place.longitude,
            latitude: d.place.latitude,
          }
        : null,
    };
  }
}
