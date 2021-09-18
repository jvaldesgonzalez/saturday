import { InteractionType } from '../enums/interaction-type.enum';
import { SocialGraphNode } from './social-graph-node.entity';

export abstract class SocialGraphInteraction {
  to: SocialGraphNode;
  interactionType: InteractionType;

  constructor(to: SocialGraphNode, type: InteractionType) {
    this.to = to;
    this.interactionType = type;
  }
}
