import {Guard} from "src/shared/core/Guard";
import {Fail, Ok, Result} from "src/shared/core/Result";
import {AggregateDomainEntity} from "src/shared/domain/aggregate-entity.abstract";
import {UniqueEntityID} from "src/shared/domain/UniqueEntityID";
import {PlanEvent, PlanEventCollection} from "./plan-event.entity";
import {PlanMember, PlanMemberCollection} from "./plan-member.entity";
import {PlanDescription} from "./value-objects/plan-description.value";
import {PlanName} from "./value-objects/plan-name.value";

type PlanProps = {
	name: PlanName;
	description: PlanDescription;
	members: PlanMemberCollection;
	createdBy: PlanMember;
	adminList: PlanMemberCollection;
	events: PlanEventCollection;
	createdAt: Date;
	updatedAt: Date;
}

export class Plan extends AggregateDomainEntity<PlanProps>{
	public static readonly MAX_MEMBERS = 50;

	public get name(): PlanName {
		return this.props.name;
	}
	public get description(): PlanDescription {
		return this.props.name;
	}
	public get members(): PlanMemberCollection {
		return this.props.members;
	}
	public get creator(): PlanMember {
		return this.props.createdBy;
	}
	public get adminList(): PlanMemberCollection {
		return this.props.adminList;
	}
	public get events(): PlanEventCollection {
		return this.props.events;
	}
	public get createdAt(): Date {
		return this.props.createdAt;
	}
	public get updatedAt(): Date {
		return this.props.updatedAt;
	}

	public changeName(name: PlanName): Result<void> {
		this.props.name = name;
		this.props.updatedAt = new Date();
		return Ok();
	}

	public changeDescription(desc: PlanDescription): Result<void> {
		this.props.description = desc;
		this.props.updatedAt = new Date();
		return Ok();
	}

	public addMembers(members: PlanMember[]): Result<void> {
		const futureAmount = this.members.getItems().length + members.length;
		const againstMaxIntegrantsGuard = Guard.lesserThanEqual(Plan.MAX_MEMBERS, futureAmount, 'members amount');
		if (!againstMaxIntegrantsGuard.succeeded) return Fail(againstMaxIntegrantsGuard.message);

		members.forEach((m) => this.props.members.add(m))

		this.props.updatedAt = new Date();
		return Ok();
	}

	public removeMembers(members: PlanMember[]): Result<void> {
		const isOwner = !!members.find((m) => m.equals(this.creator));
		if (isOwner) return Fail(`owner cannot be removed`);
		members.forEach((m) => this.props.members.remove(m))

		this.props.updatedAt = new Date();
		return Ok();
	}

	public addAdmin(member: PlanMember): Result<void> {
		const memberIsInGroup = this.props.members.exists(member);
		if (!memberIsInGroup) return Fail(`member ${member._id.toString()} not in group ${this._id.toString()}`)
		this.props.adminList.add(member);
		this.props.updatedAt = new Date();
		return Ok();
	}

	public removeAdmin(admin: PlanMember): Result<void> {
		const isOwner = !!this.adminList.currentItems.find((m) => m.equals(this.creator));
		if (isOwner) return Fail(`owner cannot be downgraded from admin`);

		this.adminList.remove(admin);
		this.props.updatedAt = new Date();
		return Ok();
	}

	public addEvent(event: PlanEvent): Result<void> {
		this.props.events.add(event);
		this.props.updatedAt = new Date();
		return Ok();
	}

	public static new(props: Omit<PlanProps, "members" | "adminList" | "events" | "createdAt" | "updatedAt">): Result<Plan> {
		return Plan.create({
			...props,
			members: new PlanMemberCollection([props.createdBy], true),
			adminList: new PlanMemberCollection([props.createdBy], true),
			events: new PlanEventCollection(),
			createdAt: new Date(),
			updatedAt: new Date(),
		}, new UniqueEntityID());
	}

	public static create(props: PlanProps, id: UniqueEntityID): Result<Plan> {
		const notEmptyMembers = Guard.inRange({argumentPath: 'memebers length', max: Plan.MAX_MEMBERS, min: 0, num: props.members.getItems().length});
		const notEmptyAdmins = Guard.inRange({argumentPath: 'admin list length', max: Plan.MAX_MEMBERS, min: 0, num: props.members.getItems().length});
		const againstNil = Guard.againstNullOrUndefinedBulk([
			{
				argumentPath: 'name', argument: props.name,
			},
			{
				argumentPath: 'description', argument: props.description,
			},
			{
				argumentPath: 'creator', argument: props.createdBy,
			}
		])

		for (const guardResult of [notEmptyAdmins, notEmptyMembers, againstNil]) {
			if (!guardResult.succeeded)
				return Fail(guardResult.message);
		}

		return Ok(new Plan(props, id));
	}
}
