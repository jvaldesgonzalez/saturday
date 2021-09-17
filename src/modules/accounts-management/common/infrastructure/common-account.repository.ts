import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { ICommonAccountRepository } from '../application/interfaces/common-account.repository.interface';
import { CommonAccount } from '../domain/common-account.domain';
import { CommonAccountEntity } from './entities/common-account.entity';
import { CommonAccountMappers } from './mappers/common-account.mapper';

@Injectable()
export class CommonAccountRepository
  extends BaseRepository<CommonAccount, CommonAccountEntity>
  implements ICommonAccountRepository
{
  constructor(
    @InjectPersistenceManager() persistenceManager: PersistenceManager,
  ) {
    super(
      'CommonAccount',
      CommonAccountMappers.toPersistence,
      'CommonAccount',
      persistenceManager,
    );
  }
  async usernameExists(theUsername: string): Promise<boolean> {
    const uname = await this.persistenceManager.maybeGetOne<string>(
      QuerySpecification.withStatement(
        `
				MATCH (u:Account)
				WHERE u.username = $uname
				return u.username
			`,
      ).bind({ uname: theUsername }),
    );
    return !!uname;
  }
}
