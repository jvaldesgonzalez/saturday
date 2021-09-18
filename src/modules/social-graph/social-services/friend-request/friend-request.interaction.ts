import { ApiResponseProperty } from '@nestjs/swagger';
import { SocialGraphInteraction } from '../../common/interaction.interface';
import { SocialGraphNode } from '../../common/social-graph-node.entity';
import { InteractionType } from '../../enums/interaction-type.enum';

export class FriendRequestInteraction extends SocialGraphInteraction {
  constructor(to: SocialGraphNode) {
    super(to, InteractionType.FriendRequest);
  }
}

export class Requester {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  username: string;
  @ApiResponseProperty()
  email: string;
  @ApiResponseProperty()
  avatar: string;
  @ApiResponseProperty()
  fullname: string;
  @ApiResponseProperty()
  requestedAt: Date;
  @ApiResponseProperty()
  friendsInCommon: number;
}
