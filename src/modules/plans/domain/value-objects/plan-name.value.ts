import { Guard } from "src/shared/core/Guard";
import { Fail, Ok, Result } from "src/shared/core/Result";
import { ValueObject } from "src/shared/domain/value-object.abstract";

type PlanNameProps = {
    value: string;
}

export class PlanName extends ValueObject<PlanNameProps>{
    public static readonly MIN_LEN = 1;
    public static readonly MAX_LEN = 160;
    
    public get value() : string {
        return this.props.value;
    }
    
    public static create(name: string): Result<PlanName> {
        const againstNil = Guard.againstNullOrUndefined(name,'name');
        
        if (!againstNil.succeeded) return Fail(againstNil.message);

        const againstAtLeast = Guard.inRange({
            argumentPath: 'len(name)',
            max: this.MAX_LEN,
            min: this.MIN_LEN,
            num: name.length,
        });
        if (!againstAtLeast.succeeded) return Fail(againstAtLeast.message);

        return Ok(new PlanName({ value: name }));
    }
}