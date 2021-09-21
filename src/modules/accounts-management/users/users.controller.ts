import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersReadService } from './users.read-service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readService: UsersReadService) {}

  @Get('/me/profile')
  async getProfile() {
    return await this.readService.getProfile('blabla');
  }
}
