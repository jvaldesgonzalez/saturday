import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { SocialGraphInteraction } from './interaction.interface';
import { SocialGraphNode } from './social-graph-node.entity';
import { UserInteractor } from './user.interactor';

export interface ISocialGraphService<
  TRead,
  T extends SocialGraphInteraction = SocialGraphInteraction,
> {
  save(from: SocialGraphNode, interaction: T): Promise<void>;
  drop(from: SocialGraphNode, interaction: T): Promise<void>;
  isPosible(interaction: T, from?: SocialGraphNode): Promise<boolean>;
  getOutgoings?(
    from: SocialGraphNode,
    skip: number,
    limit: number,
    searchTerm?: string,
  ): Promise<PaginatedFindResult<TRead>>;
  getIngoings?(
    interaction: T,
    from?: SocialGraphNode,
  ): PaginatedFindResult<UserInteractor>;
}
