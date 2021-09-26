import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { ISocialGraphService } from '../../common/social-graph.service.interface';
import { BlockInteraction } from './block.interaction';

@Injectable()
export class BlockService
  implements ISocialGraphService<any, BlockInteraction>
{
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async save(
    from: UniqueEntityID,
    interaction: BlockInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User),(o:User)
				WHERE u.id = $uId AND o.id = $oId
				MERGE (u)-[:BLOCK {createdAt: datetime()}]->(o)`,
      ).bind({ uId: from.toString(), oId: interaction.to.toString() }),
    );
  }

  async drop(
    from: UniqueEntityID,
    interaction: BlockInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[r:BLOCK]->(blocked:User)
				WHERE u.id = $uId AND blocked.id = $blockedId
				DELETE r
				`,
      ).bind({ uId: from.toString(), blockedId: interaction.to.toString() }),
    );
  }

  async isPosible(interaction: BlockInteraction): Promise<boolean> {
    return await this.persistenceManager.getOne<boolean>(
      QuerySpecification.withStatement(
        `
				OPTIONAL MATCH (n:User)
				WHERE n.id = $uId
				CALL apoc.when(n is null,'return false as result','return true as result',{}) yield value
				RETURN value
			`,
      ).bind({ uId: interaction.to.toString() }),
    );
  }
}
