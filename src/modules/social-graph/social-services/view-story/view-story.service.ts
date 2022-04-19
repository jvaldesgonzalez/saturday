import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { makeDate } from 'src/shared/modules/data-access/neo4j/utils';
import { ISocialGraphService } from '../../common/social-graph.service.interface';
import { ViewStoryInteraction } from './view-story.interaction';

@Injectable()
export class ViewStoryService
  implements ISocialGraphService<any, ViewStoryInteraction>
{
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async save(
    from: UniqueEntityID,
    interaction: ViewStoryInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User),(s:Story)
				WHERE u.id = $uId AND s.id = $sId
				MERGE (u)-[r:VIEW]->(s)
				SET r.createdAt = $now`,
      ).bind({
        uId: from.toString(),
        sId: interaction.to.toString(),
        now: makeDate(new Date()),
      }),
    );
  }

  async drop(
    from: UniqueEntityID,
    interaction: ViewStoryInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[r:VIEW]->(s:Story)
				WHERE u.id = $uId AND s.id = $sId
				DELETE r
				`,
      ).bind({ uId: from.toString(), sId: interaction.to.toString() }),
    );
  }

  async isPosible(interaction: ViewStoryInteraction): Promise<boolean> {
    return await this.persistenceManager.getOne<boolean>(
      QuerySpecification.withStatement(
        `
				OPTIONAL MATCH (n:Story)
				WHERE n.id = $sId
				CALL apoc.when(n is null,'return false as result','return true as result',{}) yield value
				RETURN value
			`,
      ).bind({ sId: interaction.to.toString() }),
    );
  }
}
