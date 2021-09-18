import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { ISocialGraphService } from '../../common/social-graph.service.interface';
import { FollowInteraction } from './follow.interaction';

@Injectable()
export class FollowService implements ISocialGraphService<FollowInteraction> {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}
  async save(
    from: UniqueEntityID,
    interaction: FollowInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User),(p:Partner)
				WHERE u.id = $uId AND p.id = $pId
				MERGE (u)-[:FOLLOW]->(p)`,
      ).bind({ uId: from.toString(), pId: interaction.to.toString() }),
    );
  }

  async drop(
    from: UniqueEntityID,
    interaction: FollowInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[r:FOLLOW]->(p:Partner)
				WHERE u.id = $uId AND p.id = $pId
				DELETE r
				`,
      ).bind({ uId: from.toString(), pId: interaction.to.toString() }),
    );
  }

  async isPosible(interaction: FollowInteraction): Promise<boolean> {
    return await this.persistenceManager.getOne<boolean>(
      QuerySpecification.withStatement(
        `
				OPTIONAL MATCH (n:Partner)
				WHERE n.id = $pId
				CALL apoc.when(n is null,'return false as result','return true as result',{}) yield value
				RETURN value.result
			`,
      ).bind({ pId: interaction.to.toString() }),
    );
  }
}
