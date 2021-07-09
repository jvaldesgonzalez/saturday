import {Guard} from "src/shared/core/Guard";
import {Fail, Ok, Result} from "src/shared/core/Result";
import {AggregateDomainEntity} from "src/shared/domain/aggregate-entity.abstract";
import {UniqueEntityID} from "src/shared/domain/UniqueEntityID";
import {RecipientId} from "./recipientId.entity";

export type NotificationType =
	| 'friend-request'
	| 'fiend-request-acepted'
	| 'shared-event'
	| 'plan-invitation'
	| 'custom';

type NotificationProps = {
	title: string;
	description: string;
	type: NotificationType;
	createdAt: Date;
	updatedAt: Date;
	recipientId: RecipientId;
};


export class Notification extends AggregateDomainEntity<NotificationProps>{
	public readonly __brand: void;

	get title(): string {
		return this.props.title;
	}

	get description(): string {
		return this.props.description
	}

	get type(): NotificationType {
		return this.props.type;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	get recipientId():RecipientId{
		return this.props.recipientId;
	}

	public static new(
		props: Omit<NotificationProps, 'createdAt' | 'updatedAt'>,
	): Result<Notification> {
		return this.create(
			{
				...props,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			new UniqueEntityID(),
		);
	}

	public static create(props: NotificationProps, _id: UniqueEntityID): Result<Notification> {
		const nilGuard = Guard.againstNullOrUndefinedBulk([
			{argument: props.title, argumentPath: 'title'},
			{argument: props.description, argumentPath: 'description', }
		])
		if (!nilGuard.succeeded) return Fail(nilGuard.message);
		return Ok(new Notification(props, _id));
	}
}
