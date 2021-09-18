import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { SocialGraphNode } from '../../common/social-graph-node.entity';
import { ISocialGraphService } from '../../common/social-graph.service.interface';
import { FriendInteraction } from './friend.interaction';

@Injectable()
export class FriendService implements ISocialGraphService<FriendInteraction> {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}
  async save(
    from: UniqueEntityID,
    interaction: FriendInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User),(f:User)
				WHERE u.id = $uId AND f.id = $fId
				MERGE (u)-[:FRIEND {createdAt: datetime()}]->(f)`,
      ).bind({ uId: from.toString(), fId: interaction.to.toString() }),
    );
  }

  async drop(
    from: UniqueEntityID,
    interaction: FriendInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[r:FRIEND]->(f:User)
				WHERE u.id = $uId AND f.id = $fId
				DELETE r
				`,
      ).bind({ uId: from.toString(), fId: interaction.to.toString() }),
    );
  }

  async isPosible(
    interaction: FriendInteraction,
    from: SocialGraphNode,
  ): Promise<boolean> {
    return await this.persistenceManager.getOne<boolean>(
      QuerySpecification.withStatement(
        `
				OPTIONAL MATCH (n:User)-[:FRIEND_REQUEST]->(sender:User)
				WHERE n.id = $fId AND sender.id = $senderId
				CALL apoc.when(n is null,'return false as result','return true as result',{}) yield value
				RETURN value.result
			`,
      ).bind({ fId: interaction.to.toString(), senderId: from.toString() }),
    );
  }
}
