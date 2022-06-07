import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsNumber,
  Min,
  IsUrl,
  IsString,
  MinLength,
  IsLatitude,
  IsLongitude,
  IsUUID,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

class Place {
  @ApiProperty()
  address: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  @IsLatitude()
  latitude: number;
  @ApiProperty()
  @IsLongitude()
  longitude: number;
  @ApiProperty()
  @IsUUID(4)
  locationId: string;
}

class BusinessDescription {
  @ApiProperty()
  inline: boolean;
  @ApiProperty()
  header: string;
  @ApiProperty()
  body: string;
}

export class RegisterPartnerRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  firebasePushId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  appVersion: number;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ type: Place })
  place: Place;

  @ApiProperty({ type: [BusinessDescription] })
  @IsNotEmpty()
  aditionalBusinessData: BusinessDescription[];
}
