import { Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { minioConfig, staticsBucketConfig } from './config/minio.config';
import { PresignedUrlResult } from './interfaces/presigned-url.result';
import { IStaticsService } from './interfaces/statics.service.interface';
import { StaticUtils } from 'src/shared/utils/static.utils';
import { Theme } from './enums/themes.enum';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

@Injectable()
export class StaticsService implements IStaticsService {
  private logger: Logger;
  constructor(private minioService: MinioService) {
    this.logger = new Logger('Minio StaticsService');
  }

  async getSignedUrl(objectName: string): Promise<PresignedUrlResult> {
    this.logger.log(`Generating url for object ${objectName}`);

    const objectWithSlug = `${objectName}-${new UniqueEntityID().toString()}`;

    const url = await this.minioService.client.presignedPutObject(
      staticsBucketConfig.name,
      objectWithSlug,
      staticsBucketConfig.ttl,
    );
    return {
      putUrl: url,
      readUrl: `http://${minioConfig.endPoint}:${minioConfig.port}/${staticsBucketConfig.name}/${objectWithSlug}`,
      expTime: staticsBucketConfig.ttl,
      fileName: objectWithSlug,
    };
  }

  async getDefaultProfileImageUrl(theme: Theme): Promise<string> {
    return StaticUtils.getDefaultProfileImageUrl(theme);
  }
}
