import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/accounts-management/auth/decorators/current-user.decorator';
import { JWTClaim } from 'src/modules/accounts-management/auth/login-payload.type';
import { MyPurchases } from './presentation/my-purchases';
import { PurchasesReadService } from './purchases.read-service';

@ApiBearerAuth()
@ApiTags('purchases')
@Controller('purchases')
export class PurchasesController {
  constructor(private readService: PurchasesReadService) {}

  @Get()
  @ApiOkResponse({ type: [MyPurchases] })
  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'take', type: Number })
  async getMyPurchases(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @CurrentUser() payload: JWTClaim,
  ) {
    return await this.readService.getMyPurchases(payload.id, skip, limit);
  }

  @Get('/:id')
  @ApiOkResponse({ type: MyPurchases })
  async getPurchaseById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    const purchase = await this.readService.getPurchaseDetail(payload.id, id);
    if (!purchase)
      throw new NotFoundException('purchase not found on this user');
    return purchase;
  }
}
