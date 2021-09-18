import { ApiResponseProperty } from '@nestjs/swagger';
import { SocialGraphInteraction } from '../../common/interaction.interface';
import { SocialGraphNode } from '../../common/social-graph-node.entity';
import { InteractionType } from '../../enums/interaction-type.enum';

export class FollowInteraction extends SocialGraphInteraction {
  constructor(to: SocialGraphNode) {
    super(to, InteractionType.Follow);
  }
}

export class Followee {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  username: string;
  @ApiResponseProperty()
  email: string;
  @ApiResponseProperty()
  avatar: string;

  @ApiResponseProperty()
  businessName: string;
  @ApiResponseProperty()
  amountOfFollowers: number;
  @ApiResponseProperty()
  followSince: Date;
}
