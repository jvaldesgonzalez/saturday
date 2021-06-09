import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class DescriptionField {
  @ApiProperty()
  header: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  inline: boolean;
}

class Place {
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  longitude: string;
  @ApiProperty()
  latitude: string;
}

export class RegisterBusinessRequest {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ type: DescriptionField })
  @Type(() => DescriptionField)
  @IsNotEmpty()
  description: DescriptionField;

  @ApiProperty({ type: [DescriptionField] })
  aditionalBusinessData: DescriptionField[];

  @ApiPropertyOptional()
  @IsOptional()
  place: Place;
}

export class RegisterBusinessBody extends OmitType(RegisterBusinessRequest, [
  'userId',
] as const) {}
