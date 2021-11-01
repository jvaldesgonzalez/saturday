import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../accounts-management/auth/decorators/current-user.decorator';
import { JWTClaim } from '../accounts-management/auth/login-payload.type';
import { NotificationsReadService } from './notifications.read-service';

@ApiBearerAuth()
@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readService: NotificationsReadService) {}

  @Get('/me')
  @ApiQuery({ name: 'take', type: Number })
  @ApiQuery({ name: 'skip', type: Number })
  async getNotifications(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @CurrentUser() payload: JWTClaim,
  ) {
    return this.readService.findByRecipient(payload.id, skip, limit);
  }
}
