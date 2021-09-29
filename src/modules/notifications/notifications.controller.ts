import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { NotificationsReadService } from './notifications.read-service';

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
  ) {
    return this.readService.findByRecipient(
      '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
      skip,
      limit,
    );
  }
}
