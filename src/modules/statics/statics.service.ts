import { Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { minioConfig, staticsBucketConfig } from './config/minio.config';
import { PresignedUrlResult } from './interfaces/presigned-url.result';
import { IStaticsService } from './interfaces/statics.service.interface';

@Injectable()
export class StaticsService implements IStaticsService {
  private logger: Logger;
  constructor(private minioService: MinioService) {
    this.logger = new Logger('Minio StaticsService');
  }

  async getSignedUrl(objectName: string): Promise<PresignedUrlResult> {
    this.logger.log(`Generating url for object ${objectName}`);

    const url = await this.minioService.client.presignedPutObject(
      'saturday.static',
      objectName,
      24 * 60 * 60,
    );
    return {
      putUrl: url,
      readUrl: `http://${minioConfig.endPoint}:${minioConfig.port}/${staticsBucketConfig.name}/${objectName}`,
      expTime: staticsBucketConfig.ttl,
      fileName: objectName,
    };
  }
}
