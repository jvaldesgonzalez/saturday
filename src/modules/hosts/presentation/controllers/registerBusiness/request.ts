import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

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

  @ApiProperty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiPropertyOptional({ type: [DescriptionField] })
  aditionalBusinessData: DescriptionField[];

  @ApiPropertyOptional({ type: Place })
  @IsOptional()
  place: Place;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  profileImage: string;
}

export class RegisterBusinessBody extends PickType(RegisterBusinessRequest, [
  'aditionalBusinessData',
  'place',
  'profileImage',
  'businessName',
  'phoneNumber',
] as const) {}
