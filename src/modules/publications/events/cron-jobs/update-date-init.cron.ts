import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { makeDate } from 'src/shared/modules/data-access/neo4j/utils';

@Injectable()
export class UpdateEventsDateTimesCron {
  private logger: Logger;
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {
    this.logger = new Logger('UpdateDateTimeInitInEvents');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    this.logger.log('Updating times');
    this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
			MATCH (e:Event)
			WHERE e.dateTimeEnd > $now
			WITH head(apoc.coll.sort([(e)-[:HAS_OCCURRENCE]->(o:EventOccurrence) WHERE o.dateTimeInit >= $now |o.dateTimeInit])) as newDateTimeInit,e
			SET e.dateTimeInit = CASE WHEN newDateTimeInit IS NULL THEN e.dateTimeInit ELSE newDateTimeInit END
			`,
      ).bind({ now: makeDate(new Date()) }),
    );
  }
}
