import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
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

  @ApiProperty()
  @IsString()
  businessName: string;

  @ApiProperty({ type: DescriptionField })
  @Type(() => DescriptionField)
  @IsNotEmpty()
  description: DescriptionField;

  @ApiPropertyOptional({ type: [DescriptionField] })
  aditionalBusinessData: DescriptionField[];

  @ApiPropertyOptional()
  @IsOptional()
  place: Place;
}

export class RegisterBusinessBody extends PickType(RegisterBusinessRequest, [
  'description',
  'aditionalBusinessData',
  'place',
  'businessName',
] as const) {}
