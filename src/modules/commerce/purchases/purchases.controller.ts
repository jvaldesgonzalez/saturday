import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MyPurchases } from './presentation/my-purchases';
import { PurchasesReadService } from './purchases.read-service';

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
  ) {
    return await this.readService.getMyPurchases('blabla', skip, limit);
  }
}
