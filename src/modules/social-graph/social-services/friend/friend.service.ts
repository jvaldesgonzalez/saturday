import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { SocialGraphNode } from '../../common/social-graph-node.entity';
import { ISocialGraphService } from '../../common/social-graph.service.interface';
import { FriendInteraction } from './friend.interaction';

@Injectable()
export class FriendService
  implements ISocialGraphService<any, FriendInteraction>
{
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}
  getOutgoings(
    from: UniqueEntityID,
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<any>> {
    throw new Error('Method not implemented.');
  }
  async save(
    from: UniqueEntityID,
    interaction: FriendInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[req:FRIEND_REQUEST]-(f:User)
				WHERE u.id = $uId AND f.id = $fId
				DELETE req
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
