import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { Gender } from '../domain/value-objects/gender.value';

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

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  avatar: string;
}
