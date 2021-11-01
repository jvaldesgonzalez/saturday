import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccountsManagementReadService } from './accounts-management.read-service';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { JWTClaim } from './auth/login-payload.type';

@ApiBearerAuth()
@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readService: AccountsManagementReadService) {}

  @Get('/with-username/:username')
  async getAccountByUsername(
    @Param('username') username: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    username = username[0] === '@' ? username.slice(1) : username;

    return await this.readService.getAccountByUsername(username, payload.id);
  }
}
