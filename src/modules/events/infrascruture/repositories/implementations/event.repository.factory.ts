import { PersistenceManager } from '@liberation-data/drivine';
import { Event } from 'src/modules/events/domain/entities/event.entity';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { OrmName } from 'src/shared/modules/data-access/enums/orm-names.enum';
import { IEventRepository } from '../interfaces/IEventRepository';

export class EventRepositoryFactory
  implements IRepositoryFactory<Event, IEventRepository> {
  getOrmName(): string {
    return OrmName.NEO4J_DRIVINE;
  }

  build(txManager: PersistenceManager): IEventRepository {
    return null; //TODO: build event repository
  }
}
