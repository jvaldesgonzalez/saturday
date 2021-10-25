import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { SocialGraphInteraction } from '../../common/interaction.interface';
import { SocialGraphNode } from '../../common/social-graph-node.entity';
import { InteractionType } from '../../enums/interaction-type.enum';

export class ShareInteraction extends SocialGraphInteraction {
  publication: SocialGraphNode;
  to: SocialGraphNode[];

  constructor(to: SocialGraphNode[], publication: SocialGraphNode) {
    super(to, InteractionType.Share);
    this.publication = publication;
  }
}

export class ShareBody {
  @ApiProperty()
  @IsUUID()
  eventId: string;
  @ApiProperty()
  @IsUUID(4, { each: true })
  shareWith: string[];
}
