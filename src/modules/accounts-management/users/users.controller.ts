import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersReadService } from './users.read-service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readService: UsersReadService) {}

  @Get('/me/profile')
  async getProfile() {
    return await this.readService.getMyProfile(
      '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
    );
  }

  @Get('/:userId/profile')
  async getUserProfile(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.readService.getProfile(
      '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
      userId,
    );
  }
}
