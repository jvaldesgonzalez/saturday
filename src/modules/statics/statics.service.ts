import { Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { PresignedUrlResult } from './interfaces/presigned-url.result';
import { IStaticsService } from './interfaces/statics.service.interface';

@Injectable()
export class StaticsService implements IStaticsService {
  private logger: Logger;
  constructor(private minioService: MinioService) {
    this.logger = new Logger('Minio StaticsService');
  }

  async getSignedUrl(objectName: string): Promise<PresignedUrlResult> {
    throw new Error('Not Implemented Error');
    // const client = this.minioService.client.presignedPutObject(
    //   bucketName,
    //   objectName,
    //   callback,
    // );
  }
}
