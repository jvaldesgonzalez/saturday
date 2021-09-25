import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountsManagementReadService } from './accounts-management.read-service';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readService: AccountsManagementReadService) {}

  @Get('/with-username/:username')
  async getAccountByUsername(@Param('username') username: string) {
    username = username[0] === '@' ? username.slice(1) : username;

    return await this.readService.getAccountByUsername(
      username,
      '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
    );
  }
}
