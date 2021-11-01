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
  ) {
    return await this.readService.getMyPurchases('blabla', skip, limit);
  }

  @Get('/:id')
  @ApiOkResponse({ type: MyPurchases })
  async getPurchaseById(@Param('id', ParseUUIDPipe) id: string) {
    const purchase = await this.readService.getPurchaseDetail(id);
    if (!purchase)
      throw new NotFoundException('purchase not found on this user');
    return purchase;
  }
}
