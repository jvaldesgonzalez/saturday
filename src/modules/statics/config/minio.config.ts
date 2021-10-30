import { MinioOptions } from 'nestjs-minio-client/dist/interfaces/minio.options.interface';

export const minioConfig: MinioOptions = {
  endPoint: '152.206.177.203',
  port: 9000,
  useSSL: false,
  accessKey: 'minio',
  secretKey: 'hJG5myodnc9cc4!N',
};
