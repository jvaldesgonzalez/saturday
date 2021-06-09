import {Guard, GuardArgumentCollection} from 'src/shared/core/Guard';
import {Fail, Ok, Result} from 'src/shared/core/Result';
import {AggregateDomainEntity} from 'src/shared/domain/aggregate-entity.abstract';
import {BusinessData} from '../value-objects/bussines-data.value';
import {DescriptionField} from '../value-objects/description-fields.value';
import {HostPlace} from '../value-objects/host-place.value';
import {UserRef} from './userRef.entity';

type HostProps = {
	userRef: UserRef;
	businessDescription: DescriptionField;
	aditionalBusinessData: BusinessData;
	place?: HostPlace;
	createdAt: Date;
	updatedAt: Date;
};

/* type NewHostProps = Omit<HostProps, 'createdAt' | 'updatedAt'>; */

export class Host extends AggregateDomainEntity<HostProps>{
	get user(): UserRef {
		return this.props.userRef;
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

	/* public static new(props: NewHostProps): Result<Host> { */
	/*   return this.create( */
	/*     { */
	/*       ...props, */
	/*       createdAt: new Date(), */
	/*       updatedAt: new Date(), */
	/*     }, */
	/*     new UniqueEntityID(), */
	/*   ); */
	/* } */

	public static create(props: HostProps): Result<Host> {
		const args: GuardArgumentCollection = [
			{argument: props.userRef, argumentPath: 'userId'}
		];
		const nullGuard = Guard.againstNullOrUndefinedBulk(args);
		if(!nullGuard.succeeded) return Fail(nullGuard.message)
		return Ok(new Host(props,props.userRef.id))
	}
}
