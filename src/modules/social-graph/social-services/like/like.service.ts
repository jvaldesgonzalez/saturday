import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { ISocialGraphService } from '../../common/social-graph.service.interface';
import { LikeInteraction } from './like.interaction';

@Injectable()
export class LikeService implements ISocialGraphService<LikeInteraction> {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}
  async save(
    from: UniqueEntityID,
    interaction: LikeInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User),(e:Event)
				WHERE u.id = $uId AND e.id = $eId
				MERGE (u)-[:LIKE {likedAt: datetime()}]->(e)`,
      ).bind({ uId: from.toString(), eId: interaction.to.toString() }),
    );
  }

  async drop(
    from: UniqueEntityID,
    interaction: LikeInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[r:LIKE]->(e:Event)
				WHERE u.id = $uId AND e.id = $eId
				DELETE r
				`,
      ).bind({ uId: from.toString(), eId: interaction.to.toString() }),
    );
  }

  async isPosible(interaction: LikeInteraction): Promise<boolean> {
    return await this.persistenceManager.getOne<boolean>(
      QuerySpecification.withStatement(
        `
				OPTIONAL MATCH (n:Event)
				WHERE n.id = $eId
				CALL apoc.when(n is null,'return false as result','return true as result',{}) yield value
				RETURN value.result
			`,
      ).bind({ eId: interaction.to.toString() }),
    );
  }
}
