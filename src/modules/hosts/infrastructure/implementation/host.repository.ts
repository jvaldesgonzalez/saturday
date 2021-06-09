import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { Host } from '../../domain/entities/host.entity';
import { HostEntity } from '../entities/host.entity';
import { IHostRepository } from '../interfaces/host.repository.interface';
import { HostMapper } from '../mapper/host.mapper';

export class HostRepository
  extends BaseRepository<Host, HostEntity>
  implements IHostRepository {
  constructor(
    @InjectPersistenceManager() readonly persistenceManager: PersistenceManager,
  ) {
    super(
      'Host',
      HostMapper.DomainToPersistent,
      'HostRepository',
      persistenceManager,
    );
  }

  @Transactional()
  async save(host: Host): Promise<void> {
    this._logger.log(`Save entity with id: {${host._id}}`);
    await this.persistenceManager.execute(
      QuerySpecification.withStatement<void>(
        `MATCH (n:User)
        WHERE n.id = $id
        SET n+= $data
        `,
      ).bind({
        id: host._id.toString(),
        data: this._domainToPersistentFunc(host),
      }),
    );
  }

  async getUserIdAndTimestamp(
    userId: string,
  ): Promise<{ userId: string; createdAt: Date; updatedAt: Date }> {
    this._logger.log('Getting correspondent user timestamps');
    const res = await this.persistenceManager.maybeGetOne<{
      userId: string;
      createdAt: string;
      updatedAt: string;
    }>(
      QuerySpecification.withStatement(
        `MATCH (n:User)
      WHERE n.id = $id
      RETURN {
        userId:n.id,
        createdAt:n.createdAt,
        updatedAt:n.updatedAt
      }
      `,
      ).bind({
        id: userId,
      }),
    );
    return res
      ? {
          userId: res.userId,
          createdAt: new Date(res.createdAt),
          updatedAt: new Date(res.updatedAt),
        }
      : null;
  }
}
