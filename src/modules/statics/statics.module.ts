import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { minioConfig } from './config/minio.config';
import { StaticsController } from './statics.controller';
import { StaticsService } from './statics.service';

@Module({
  imports: [MinioModule.register(minioConfig)],
  providers: [StaticsService],
  controllers: [StaticsController],
})
export class StaticsModule {}
