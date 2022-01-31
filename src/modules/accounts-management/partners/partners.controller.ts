import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JWTClaim } from '../auth/login-payload.type';
import { UpdatePartnerErrors } from './application/usecases/updatePartner/update-partner.errors';
import { UpdatePartner } from './application/usecases/updatePartner/update-partner.usecase';
import { PartnersReadService } from './partners.read-service';
import { UpdatePartnerBody } from './presentation/update-partner';

@ApiBearerAuth()
@ApiTags('partners')
@Controller('partners')
export class PartnersController {
  constructor(
    private readService: PartnersReadService,
    private updateProfile: UpdatePartner,
  ) {}

  @Get('/me/profile')
  async getMyProfile(@CurrentUser() payload: JWTClaim) {
    const partner = await this.readService.getMyProfile(payload.id);
    if (!partner) throw new NotFoundException('partner not found');
    return partner;
  }

  @Get('/:id/profile')
  @ApiParam({ name: 'id' })
  async getProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    const partner = await this.readService.getProfile(id, payload.id);
    if (!partner) throw new NotFoundException('partner not found');
    return partner;
  }

  @Put('/me/profile')
  async updatePartnerProfile(
    @Body() data: UpdatePartnerBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const result = await this.updateProfile.execute({
      ...data,
      id: payload.id,
    });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UpdatePartnerErrors.PartnerNotFound:
          throw new NotFoundException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else if (result.isRight()) {
      return result.value.getValue();
    }
  }
}
