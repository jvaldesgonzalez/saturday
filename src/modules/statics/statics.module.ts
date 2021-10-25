import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';

@Module({
  imports: [MinioModule],
})
export class StaticsModule {}
