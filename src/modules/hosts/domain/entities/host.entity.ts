import { Guard, GuardArgumentCollection } from 'src/shared/core/Guard';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { AggregateDomainEntity } from 'src/shared/domain/aggregate-entity.abstract';
import { BusinessName } from '../value-objects/business-name.value';
import { BusinessData } from '../value-objects/bussines-data.value';
import { DescriptionField } from '../value-objects/description-fields.value';
import { HostPhone } from '../value-objects/host-phone.value';
import { HostPlace } from '../value-objects/host-place.value';
import { UserRef } from './userRef.entity';

type HostProps = {
  userRef: UserRef;
  businessName: BusinessName;
  phoneNumber: HostPhone;
  businessDescription: DescriptionField;
  aditionalBusinessData: BusinessData;
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

  get phoneNumber(): HostPhone {
    return this.props.phoneNumber;
  }

  get businessDescription(): DescriptionField {
    return this.props.businessDescription;
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

  changeBusinessDescription(description: DescriptionField): Result<void> {
    this.props.businessDescription = description;
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
    return Ok(new Host(props, props.userRef.id));
  }
}
