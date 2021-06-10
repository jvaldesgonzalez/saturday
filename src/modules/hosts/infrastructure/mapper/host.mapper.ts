import { Join, Ok } from 'src/shared/core/Result';
import { Host } from '../../domain/entities/host.entity';
import { UserRef } from '../../domain/entities/userRef.entity';
import { BusinessName } from '../../domain/value-objects/business-name.value';
import { DescriptionField } from '../../domain/value-objects/description-fields.value';
import { HostPhone } from '../../domain/value-objects/host-phone.value';
import { HostPlace } from '../../domain/value-objects/host-place.value';
import { HostProfileImg } from '../../domain/value-objects/host-profile-img.value';
import { DescriptionFieldRaw, HostEntity } from '../entities/host.entity';

export class HostMapper {
  public static PersistentToDomain(p: HostEntity): Host {
    const userRefOrError = UserRef.create(p.id);
    const businessNameOrError = BusinessName.create(p.businessName);
    const aditionalDataOrError = Join(
      (JSON.parse(
        p.aditionalBusinessData,
      ) as DescriptionFieldRaw[]).map((data) => DescriptionField.create(data)),
    );
    const placeOrError = p.place ? HostPlace.create(p.place) : Ok(undefined);
    const imageOrError = p.profileImage
      ? HostProfileImg.create(p.profileImage)
      : Ok(undefined);
    const phoneOrError = HostPhone.create(p.phoneNumber);

    return Host.create({
      phoneNumber: phoneOrError.getValue(),
      businessName: businessNameOrError.getValue(),
      userRef: userRefOrError.getValue(),
      profileImage: imageOrError.getValue(),
      aditionalBusinessData: aditionalDataOrError.getValue(),
      place: placeOrError.getValue(),
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }).getValue();
  }

  public static DomainToPersistent(d: Host): HostEntity {
    return {
      businessName: d.businessName.value,
      phoneNumber: d.phoneNumber.value,
      id: d._id.toString(),
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
      aditionalBusinessData: JSON.stringify(d.aditionalBusinessData),
      profileImage: d.profileImage ? d.profileImage.value : null,
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
