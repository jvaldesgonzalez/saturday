import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { minioConfig } from './config/minio.config';

@Module({
  imports: [MinioModule.register(minioConfig)],
})
export class StaticsModule {}
