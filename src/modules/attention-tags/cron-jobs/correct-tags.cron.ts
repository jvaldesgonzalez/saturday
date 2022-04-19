import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { makeDate } from 'src/shared/modules/data-access/neo4j/utils';

@Injectable()
export class CorrectTagsForEvents {
  private logger: Logger;
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {
    this.logger = new Logger('CorrectTagsForEvents');
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    await this.cleanTags();
  }

  private async cleanTags() {
    // this.logger.log('Cleaning...');
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(`
			MATCH (t:AttentionTag)-[r]-(e:Event)
			DELETE r
			`),
    );
    // this.logger.log('Cleaned...');
    await Promise.all([
      this.correctBestSeller(),
      this.correctSoldOut(),
      this.correctRunningOut(),
    ]);
  }

  private async correctBestSeller() {
    // this.logger.log('Correcting best seller...');
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
				MATCH (e:Event)-[:HAS_OCCURRENCE]-(:EventOccurrence)-[:HAS_TICKET]-(t:Ticket)--(r:Reservation)
				WHERE e.dateTimeEnd > $now
				WITH collect(t.amount) as amounts,e,r
				WHERE apoc.coll.sum(amounts) > 0
				WITH e,count(r) as reservations
				ORDER BY reservations DESC
				LIMIT 1
				MATCH (t:AttentionTag)
				WHERE t.code = "best_seller"
				CREATE (t)<-[:HAS_TAG]-(e)
			`,
      ).bind({ now: makeDate(new Date()) }),
    );
  }

  private async correctSoldOut() {
    // this.logger.log('Correcting sold out...');
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
				MATCH (e:Event)-[:HAS_OCCURRENCE]-(:EventOccurrence)-[:HAS_TICKET]-(t:Ticket)
				WHERE e.dateTimeEnd > $now
				WITH e,collect(t.amount) as amounts
				WHERE apoc.coll.sum(amounts) = 0
				MATCH (t:AttentionTag)
				WHERE t.code = "sold_out"
				CREATE (t)<-[:HAS_TAG]-(e)
			`,
      ).bind({ now: makeDate(new Date()) }),
    );
  }

  private async correctRunningOut() {
    // this.logger.log('Correcting running out...');
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
				MATCH (e:Event)-[:HAS_OCCURRENCE]-(:EventOccurrence)-[:HAS_TICKET]-(t:Ticket)--(r:Reservation)
				WHERE e.dateTimeEnd > $now
				WITH e,collect(t.amount) as amounts, apoc.coll.sum(collect(r.amountOfTickets)) as reservations
				WHERE 0.15*(apoc.coll.sum(amounts) + reservations) > apoc.coll.sum(amounts) AND apoc.coll.sum(amounts) <> 0
				MATCH (t:AttentionTag)
				WHERE t.code = "running_out"
				CREATE (t)<-[:HAS_TAG]-(e)
			`,
      ).bind({ now: makeDate(new Date()) }),
    );
  }
}
