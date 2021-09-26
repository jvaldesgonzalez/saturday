import { SocialGraphInteraction } from '../../common/interaction.interface';
import { SocialGraphNode } from '../../common/social-graph-node.entity';
import { InteractionType } from '../../enums/interaction-type.enum';

export class BlockInteraction extends SocialGraphInteraction {
  constructor(to: SocialGraphNode) {
    super(to, InteractionType.Block);
  }
}
