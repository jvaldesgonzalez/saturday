import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsUrl,
  IsUUID,
  Matches,
} from 'class-validator';
import { Gender } from '../domain/value-objects/gender.value';
import { PrivacyStatus } from '../domain/value-objects/privacy-status.value';

export class UpdateUserBody {
  @ApiPropertyOptional()
  @IsOptional()
  fullname: string;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthday: Date;

  @ApiPropertyOptional()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ enum: PrivacyStatus })
  @IsOptional()
  privacyStatus: PrivacyStatus;

  @ApiPropertyOptional()
  @IsUUID(4)
  @IsOptional()
  locationId: string;

  @ApiPropertyOptional({ type: [String] })
  @IsUUID(4, { each: true })
  @IsOptional()
  categoryPreferences: string[];

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  avatar: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches('^[a-z0-9_]{3,30}$')
  username: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email: string;
}
