import { SocialGraphInteraction } from './interaction.interface';
import { SocialGraphNode } from './social-graph-node.entity';

export interface ISocialGraphService<
  T extends SocialGraphInteraction = SocialGraphInteraction,
> {
  save(from: SocialGraphNode, interaction: T): Promise<void>;
  drop(from: SocialGraphNode, interaction: T): Promise<void>;
  isPosible(interaction: T, from?: SocialGraphNode): Promise<boolean>;
}
