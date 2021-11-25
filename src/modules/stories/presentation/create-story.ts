import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';
import { MultimediaType } from 'src/shared/domain/multimedia.value';

class Multimedia {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty({ enum: ['image', 'video'] })
  type: MultimediaType;
}

export class CreateStoryRequest {
  publisher: string;

  @ApiProperty({ type: Multimedia })
  multimedia: Multimedia;

  @ApiPropertyOptional()
  @IsOptional()
  attachedText: string;
}

export class CreateStoryBody extends OmitType(CreateStoryRequest, [
  'publisher',
] as const) {}
