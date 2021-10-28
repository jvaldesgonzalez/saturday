import { Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { minioConfig } from './config/minio.config';
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
      readUrl: `http://${minioConfig.endPoint}:${minioConfig.port}/saturday.static/${objectName}`,
      expTime: 24 * 60 * 60,
      fileName: 'profile-777cc88c-2e3f-4eb4-ac81-14c9323c541d',
    };
  }
}
