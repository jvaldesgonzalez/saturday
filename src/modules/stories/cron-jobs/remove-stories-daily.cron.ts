import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

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
      QuerySpecification.withStatement(`
			MATCH (s:Story)
			WHERE datetime() - duration({days:1}) > s.createdAt
			DETACH DELETE s`),
    );
  }
}
