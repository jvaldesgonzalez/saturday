import { PresignedUrlResult } from './presigned-url.result';

export interface IStaticsService {
  getSignedUrl(objectName: string): Promise<PresignedUrlResult>;
}
