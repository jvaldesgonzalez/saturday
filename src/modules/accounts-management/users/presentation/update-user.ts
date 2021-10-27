import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsUrl, IsUUID } from 'class-validator';
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
  description: string;

  @ApiPropertyOptional({ enum: PrivacyStatus })
  privacyStatus: PrivacyStatus;

  @ApiPropertyOptional()
  @IsUUID(4)
  locationId: string;

  @ApiPropertyOptional({ type: [String] })
  @IsUUID(4, { each: true })
  categoryPreferences: string[];

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  avatar: string;
}
