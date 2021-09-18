import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { ISocialGraphService } from '../../common/social-graph.service.interface';
import { FriendRequestInteraction } from './friend-request.interaction';

@Injectable()
export class FriendRequestService
  implements ISocialGraphService<FriendRequestInteraction>
{
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}
  async save(
    from: UniqueEntityID,
    interaction: FriendRequestInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User),(f:User)
				WHERE u.id = $uId AND f.id = $fId
				MERGE (u)-[:FRIEND_REQUEST]->(f)`,
      ).bind({ uId: from.toString(), fId: interaction.to.toString() }),
    );
  }

  async drop(
    from: UniqueEntityID,
    interaction: FriendRequestInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[r:FRIEND_REQUEST]->(f:User)
				WHERE u.id = $uId AND f.id = $fId
				DELETE r
				`,
      ).bind({ uId: from.toString(), fId: interaction.to.toString() }),
    );
  }

  async isPosible(interaction: FriendRequestInteraction): Promise<boolean> {
    return await this.persistenceManager.getOne<boolean>(
      QuerySpecification.withStatement(
        `
				OPTIONAL MATCH (n:User)
				WHERE n.id = $fId
				CALL apoc.when(n is null,'return false as result','return true as result',{}) yield value
				RETURN value.result
			`,
      ).bind({ fId: interaction.to.toString() }),
    );
  }
}
