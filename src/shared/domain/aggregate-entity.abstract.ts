import { AggregateRoot } from '@nestjs/cqrs';
import { IEntity, BaseProps } from '../core/interfaces/IEntity';
import { IIdentifier } from './Identifier';

export abstract class AggregateDomainEntity<TProps extends BaseProps>
  extends AggregateRoot
  implements IEntity
{
  public readonly _id: IIdentifier;
  protected readonly props: TProps;

  protected constructor(props: TProps, id: IIdentifier) {
    super();
    this._id = id;
    this.props = props;
  }

  public equals(entity: AggregateDomainEntity<TProps>): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    return this._id === entity._id;
  }
}
