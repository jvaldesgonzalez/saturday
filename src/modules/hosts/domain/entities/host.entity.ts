import { Guard, GuardArgumentCollection } from 'src/shared/core/Guard';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { AggregateDomainEntity } from 'src/shared/domain/aggregate-entity.abstract';
import { BusinessName } from '../value-objects/business-name.value';
import { BusinessData } from '../value-objects/bussines-data.value';
import { HostPhone } from '../value-objects/host-phone.value';
import { HostPlace } from '../value-objects/host-place.value';
import { HostProfileImg } from '../value-objects/host-profile-img.value';
import { UserRef } from './userRef.entity';

type HostProps = {
  userRef: UserRef;
  businessName: BusinessName;
  phoneNumber: HostPhone;
  aditionalBusinessData: BusinessData;
  profileImage?: HostProfileImg;
  place?: HostPlace;
  createdAt: Date;
  updatedAt: Date;
};

export class Host extends AggregateDomainEntity<HostProps> {
  get user(): UserRef {
    return this.props.userRef;
  }

  get businessName(): BusinessName {
    return this.props.businessName;
  }

  get profileImage(): HostProfileImg {
    return this.props.profileImage;
  }

  get phoneNumber(): HostPhone {
    return this.props.phoneNumber;
  }

  get aditionalBusinessData(): BusinessData {
    return this.props.aditionalBusinessData;
  }

  get place(): HostPlace {
    return this.props.place;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  changeBusinessName(name: BusinessName): Result<void> {
    this.props.businessName = name;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changePhoneNumber(phone: HostPhone): Result<void> {
    this.props.phoneNumber = phone;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changeProfileImage(image: HostProfileImg): Result<void> {
    this.props.profileImage = image;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changeBusinessData(data: BusinessData): Result<void> {
    this.props.aditionalBusinessData = data;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changePlace(place: HostPlace): Result<void> {
    this.props.place = place;
    this.props.updatedAt = new Date();
    return Ok();
  }

  public static create(props: HostProps): Result<Host> {
    const args: GuardArgumentCollection = [
      { argument: props.userRef, argumentPath: 'userId' },
    ];
    const nullGuard = Guard.againstNullOrUndefinedBulk(args);
    if (!nullGuard.succeeded) return Fail(nullGuard.message);
    return Ok(
      new Host(
        { ...props, aditionalBusinessData: props.aditionalBusinessData || [] },
        props.userRef.id,
      ),
    );
  }
}
