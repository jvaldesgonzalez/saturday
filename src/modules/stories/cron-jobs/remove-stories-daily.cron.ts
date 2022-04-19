import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { makeDate } from 'src/shared/modules/data-access/neo4j/utils';

@Injectable()
export class RemoveStoriesDailyCron {
  private logger: Logger;
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {
    this.logger = new Logger('RemoveStoriesDailyCron');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    this.logger.log('Removing old stories');
    this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
			MATCH (s:Story)
			WHERE $now - duration({days:1}) > s.createdAt
			DETACH DELETE s`,
      ).bind({ now: makeDate(new Date()) }),
    );
  }
}
