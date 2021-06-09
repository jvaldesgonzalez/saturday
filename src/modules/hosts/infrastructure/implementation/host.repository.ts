import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { Host } from '../../domain/entities/host.entity';
import { GetHostProfileResponse } from '../../presentation/controllers/getProfile/response';
import { HostEntity } from '../entities/host.entity';
import { IHostRepository } from '../interfaces/host.repository.interface';
import { HostMapper } from '../mapper/host.mapper';
import * as faker from 'faker';

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

  async findById(id: string): Promise<Host> {
    const res = await this.persistenceManager.maybeGetOne<HostEntity>(
      QuerySpecification.withStatement(
        `
        MATCH (n:User)
        WHERE n.id = $id
        RETURN {
          businessDescription:n.businessDescription,
          aditionalBusinessData: n.aditionalBusinessData,
          place:n.place,
          id:n.id,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt
        }
        `,
      )
        .bind({ id })
        .transform(HostEntity),
    );
    return res ? HostMapper.PersistentToDomain(res) : null;
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

  //view repository
  async getProfileByHostId(hostId: string): Promise<GetHostProfileResponse> {
    type FullHost = HostEntity & {
      fullname: string;
      username: string;
      email: string;
      profileImageUrl: string;
      events: number;
      followers: number;
    };
    const res = await this.persistenceManager.maybeGetOne<FullHost>(
      QuerySpecification.withStatement(
        `
        MATCH (n:User)
        WHERE n.id = $id
        RETURN n
        `,
      ).bind({ id: hostId }),
    );
    return {
      fullname: res.fullname,
      username: res.username,
      email: res.email,
      profileImageUrl: res.profileImageUrl,
      businessDescription: JSON.parse(res.businessDescription),
      aditionalBusinessData: JSON.parse(res.aditionalBusinessData),
      place: res.place,
      followers: faker.datatype.number(15329),
      events: faker.datatype.number(150),
    };
  }
}
