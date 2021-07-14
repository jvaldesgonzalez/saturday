import { Guard } from "src/shared/core/Guard";
import { Fail, Ok, Result } from "src/shared/core/Result";
import { AggregateDomainEntity } from "src/shared/domain/aggregate-entity.abstract";
import { UniqueEntityID } from "src/shared/domain/UniqueEntityID";
import { PlanEventCollection } from "./plan-event.entity";
import { PlanMember, PlanMemberCollection } from "./plan-member.entity";
import { PlanDescription } from "./value-objects/plan-description.value";
import { PlanName } from "./value-objects/plan-name.value";

type PlanProps = {
    name:PlanName;
    description:PlanDescription;
    members:PlanMemberCollection;
    createdBy:PlanMember;
    adminList:PlanMemberCollection;
    events:PlanEventCollection;
    createdAt:Date;
    updatedAt:Date;
}

export class Plan extends AggregateDomainEntity<PlanProps>{
    public static readonly MAX_MEMBERS = 50;

    public get name() : PlanName {
        return this.props.name;
    }
    public get description() : PlanDescription {
        return this.props.name;
    }
    public get members() : PlanMemberCollection {
        return this.props.members;
    }
    public get creator() : PlanMember {
        return this.props.createdBy;
    }
    public get adminList():PlanMemberCollection{
        return this.props.adminList;
    }
    public get events():PlanEventCollection{
        return this.props.events;
    }
    public get createdAt():Date{
        return this.props.createdAt;
    }
    public get updatedAt():Date{
        return this.props.updatedAt;
    }

    public changeName(name:PlanName):Result<void>{
        this.props.name = name;
        this.props.updatedAt = new Date();
        return Ok();
    }

    public changeDescription(desc:PlanDescription):Result<void>{
        this.props.description = desc;
        this.props.updatedAt = new Date();
        return Ok();
    }
    
    public addMembers(members:PlanMember[]):Result<void>{
        const futureAmount = this.members.getItems().length + members.length;
        const againstMaxIntegrantsGuard = Guard.lesserThanEqual(Plan.MAX_MEMBERS,futureAmount,'members amount');
        if(!againstMaxIntegrantsGuard.succeeded) return Fail(againstMaxIntegrantsGuard.message);
        
        members.forEach((m) =>this.props.members.add(m))

        this.props.updatedAt = new Date();
        return Ok();
    }

    public addAdmin(member:PlanMember):Result<void>{
        const memberIsInGroup = this.props.members.exists(member);

    }

    public changeDescription(desc:PlanDescription):Result<void>{
        this.props.description = desc;
        this.props.updatedAt = new Date();
        return Ok();
    }
    
    public static create(props:PlanProps, id:UniqueEntityID){

    }
}