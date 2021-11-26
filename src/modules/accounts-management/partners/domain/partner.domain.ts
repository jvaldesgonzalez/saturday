import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import {
  CommonAccount,
  CommonAccountProps,
} from '../../common/domain/common-account.domain';
import { PartnerDescription } from './value-objects/partner-description.value';
import { PartnerPlace } from './value-objects/partner-place.value';
import { PartnerPassword } from './value-objects/partner.password.value';
import bcrypt from 'bcrypt';

type PartnerProps = {
  businessName: string;
  phoneNumber: string;
  aditionalBusinessData: PartnerDescription;
  place?: PartnerPlace;
  password: PartnerPassword;
} & CommonAccountProps;

type NewPartnerProps = Omit<
  PartnerProps,
  'createdAt' | 'updatedAt' | 'isActive'
>;

export class Partner extends CommonAccount<PartnerProps> {
  get businessName(): string {
    return this.props.businessName;
  }

  get phoneNumber(): string {
    return this.props.phoneNumber;
  }

  get password(): string {
    return this.props.password.value;
  }

  get aditionalBusinessData(): PartnerDescription {
    return this.props.aditionalBusinessData;
  }

  get place(): PartnerPlace | undefined {
    return this.props.place;
  }

  changeBusinessName(name: string): Result<void> {
    this.props.businessName = name;
    this.props.updatedAt = new Date();
    return Ok();
  }

  hashPassword(): void {
    if (this.props.password.isHashed) return;
    this.props.password.value = bcrypt.hashSync(
      this.props.password.value,
      bcrypt.genSaltSync(),
    );
    this.props.password.isHashed = true;
  }

  paswordMatchWith(theOtherPassword: string): boolean {
    if (!this.props.password.isHashed)
      return this.props.password.value === theOtherPassword;
    return bcrypt.compareSync(theOtherPassword, this.props.password.value);
  }

  changePasswordAndHash(thePassword: string): Result<void> {
    this.props.password.value = bcrypt.hashSync(
      thePassword,
      bcrypt.genSaltSync(),
    );
    this.props.password.isHashed = true;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changePhoneNumber(phone: string): Result<void> {
    this.props.phoneNumber = phone;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changeBusinessData(data: PartnerDescription): Result<void> {
    this.props.aditionalBusinessData = data;
    this.props.updatedAt = new Date();
    return Ok();
  }

  changePlace(place: PartnerPlace): Result<void> {
    this.props.place = place;
    this.props.updatedAt = new Date();
    return Ok();
  }

  public static new(props: NewPartnerProps): Result<Partner> {
    return Partner.create(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false,
      },
      new UniqueEntityID(),
    );
  }

  public static create(
    props: PartnerProps,
    id: UniqueEntityID,
  ): Result<Partner> {
    return Ok(new Partner(props, id));
  }
}
