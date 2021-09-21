import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { SocialGraphInteraction } from '../../common/interaction.interface';
import { SocialGraphNode } from '../../common/social-graph-node.entity';
import { InteractionType } from '../../enums/interaction-type.enum';

export class LikeInteraction extends SocialGraphInteraction {
  constructor(to: SocialGraphNode) {
    super(to, InteractionType.Like);
  }
}

export class LikeBody {
  @ApiProperty()
  @IsUUID()
  eventId: string;
}
