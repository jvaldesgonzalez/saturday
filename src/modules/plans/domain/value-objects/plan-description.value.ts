import { Guard } from "src/shared/core/Guard";
import { Fail, Ok, Result } from "src/shared/core/Result";
import { ValueObject } from "src/shared/domain/value-object.abstract";

type PlanDescriptionProps = {
    value: string;
}

export class PlanDescription extends ValueObject<PlanDescriptionProps>{
    public static readonly MIN_LEN = 0;
    public static readonly MAX_LEN = 240;
    
    public get value() : string {
        return this.props.value;
    }
    
    public static create(description: string): Result<PlanDescription> {
        const againstNil = Guard.againstNullOrUndefined(description,'description');
        
        if (!againstNil.succeeded) return Fail(againstNil.message);

        const againstAtLeast = Guard.inRange({
            argumentPath: 'len(name)',
            max: this.MAX_LEN,
            min: this.MIN_LEN,
            num: description.length,
        });
        if (!againstAtLeast.succeeded) return Fail(againstAtLeast.message);

        return Ok(new PlanDescription({ value: description }));
    }
}