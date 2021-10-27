import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { ISocialGraphService } from '../../common/social-graph.service.interface';
import { ShareInteraction } from './share.interaction';

@Injectable()
export class ShareService
  implements ISocialGraphService<any, ShareInteraction>
{
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}
  async save(
    from: UniqueEntityID,
    interaction: ShareInteraction,
  ): Promise<void> {
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)
				WHERE u.id = $uId 
				CREATE (u)-[:FORWARD]->(f:ForwardedEvent)
				WITH f,e
				MATCH (t:User)
				MATCH (e:Event)
				WHERE t.id IN $recipients AND e.id = $eId
				CREATE (f)-[:FORWARDED_TO]->(t)
				CREATE (f)-[:EVENT_FORWARDED]->(e)`,
      ).bind({
        uId: from.toString(),
        recipients: interaction.to.map((node) => node.toString()),
        eId: interaction.publication.toString(),
      }),
    );
  }

  async saveForFriends(
    from: UniqueEntityID,
    event: UniqueEntityID,
  ): Promise<void> {
    console.log('saving for all friends');
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (u:User)-[:FRIEND]-(friends:User)
				WHERE u.id = $uId 
				CREATE (u)-[:FORWARD]->(f:ForwardedEvent)
				WITH u,f,friends
				MATCH (e:Event)
				WHERE e.id = $eId
				CREATE (f)-[:FORWARDED_TO]->(friends)
				CREATE (f)-[:EVENT_FORWARDED]->(e)`,
      ).bind({
        uId: from.toString(),
        eId: event.toString(),
      }),
    );
  }

  async drop(
    from: UniqueEntityID,
    interaction: ShareInteraction,
  ): Promise<void> {
    throw new Error('Not Implemented');
  }

  async isPosible(interaction: ShareInteraction): Promise<boolean> {
    return true;
    // return await this.persistenceManager.getOne<boolean>(
    //   QuerySpecification.withStatement(
    //     `
    // OPTIONAL MATCH (n:Partner)
    // WHERE n.id = $pId
    // CALL apoc.when(n is null,'return false as result','return true as result',{}) yield value
    // RETURN value.result
    // `,
    //   ).bind({ pId: interaction.to.toString() }),
    // );
  }
}
