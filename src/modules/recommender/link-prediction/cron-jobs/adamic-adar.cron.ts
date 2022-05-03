import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AdamicAdarRoutineCron {
  private logger: Logger;
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {
    this.logger = new Logger('RemoveStoriesDailyCron');
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  handleCron() {
    this.logger.log(
      'Running Adamic-Adar link-prediction routine for users and events',
    );
    this.persistenceManager.execute(
      QuerySpecification.withStatement(`
				MATCH (u:User),(e:Event)
				WITH gds.alpha.linkprediction.adamicAdar(u,e,{direction:"BOTH"}) as score,u,e
				MERGE (u)-[r:LIKE_PREDICTION]->(e)
				SET r.score = score
			`),
    );
  }
}
