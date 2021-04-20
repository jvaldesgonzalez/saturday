import { IEntity, BaseProps } from '../core/interfaces/IEntity';
import { IIdentifier } from './Identifier';

export abstract class DomainEntity<T extends BaseProps> implements IEntity {
  public readonly _id: IIdentifier;
  protected readonly props: T;

  protected constructor(props: T, id: IIdentifier) {
    this._id = id;
    this.props = props;
  }

  public equals(entity: DomainEntity<T>): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    return this._id === entity._id;
  }
}
