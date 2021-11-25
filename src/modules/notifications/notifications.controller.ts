import {
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { CurrentUser } from '../accounts-management/auth/decorators/current-user.decorator';
import { SkipAuth } from '../accounts-management/auth/decorators/skip-auth.decorator';
import { JWTClaim } from '../accounts-management/auth/login-payload.type';
import { FriendRequestNotification } from './domain/notification.domain';
import { NotificationsRepository } from './infrastructure/repository/notifications.repository';
import { NotificationsReadService } from './notifications.read-service';

@ApiBearerAuth()
@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readService: NotificationsReadService,
    private repo: NotificationsRepository,
  ) {}

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

  @SkipAuth()
  @Get('test-send/:to')
  async testSend(@Param('to', ParseArrayPipe) to: string[]) {
    const not = FriendRequestNotification.create(
      {
        recipientId: to.map((t) => new UniqueEntityID(t)),
        userData: {
          username: 'chicho',
          id: 'blabla',
          imageUrl: 'http://pingaaaa',
        },
      },
      new UniqueEntityID(),
    ).getValue();
    await this.repo.save(not);
    return not;
  }
}
