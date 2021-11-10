import { Module } from '@nestjs/common';
import { TopsController } from './tops/tops.controller';
import { TopsReadService } from './tops/tops.read-service';

@Module({
  providers: [TopsReadService],
  controllers: [TopsController],
})
export class StatsModule {}
