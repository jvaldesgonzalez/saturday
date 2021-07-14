import { Ok, Result } from "src/shared/core/Result";
import { AggregateDomainEntity } from "src/shared/domain/aggregate-entity.abstract";
import { UniqueEntityID } from "src/shared/domain/UniqueEntityID";
import { PlanMember } from "./plan-member.entity";
import { PlanRef } from "./plan-ref.entity";

type PlanInvitationProps = {
    planId:PlanRef;
    createdAt:Date;
    createdBy:PlanMember;
    recipients:PlanMember[];
}

export class PlanInvitation extends AggregateDomainEntity<PlanInvitationProps>{
    
    public get planId() : PlanRef {
        return this.props.planId;
    }

    public get createdBy() : PlanMember {
        return this.props.createdBy;
    }
    
    public get recipients() : PlanMember[] {
        return this.props.recipients;
    }
    
    public get createdAt() : Date {
        return this.props.createdAt;
    }

    public static new(props:Omit<PlanInvitationProps,'createdAt'|'updatedAt'>):Result<PlanInvitation>{
        return PlanInvitation.create({
            ...props,
            createdAt:new Date(),
        }, new UniqueEntityID())
    }

    public static create(props:PlanInvitationProps,id:UniqueEntityID):Result<PlanInvitation>{
        return Ok(new PlanInvitation(props,id));
    }
}
