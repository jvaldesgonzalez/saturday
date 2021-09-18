import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SocialGraphInteraction } from '../../common/interaction.interface';
import { SocialGraphNode } from '../../common/social-graph-node.entity';
import { InteractionType } from '../../enums/interaction-type.enum';

export class ShareInteraction extends SocialGraphInteraction {
  publication: SocialGraphNode;

  constructor(to: SocialGraphNode, publication: SocialGraphNode) {
    super(to, InteractionType.Follow);
    this.publication = publication;
  }
}

export class ShareBody {
  @ApiProperty()
  @IsNotEmpty()
  publicationId: string;
}
