import { MinioOptions } from 'nestjs-minio-client/dist/interfaces/minio.options.interface';

export const minioConfig: MinioOptions = {
  endPoint: process.env.MINIO_HOST,
  port: 80,
  useSSL: false,
  accessKey: process.env.MINIO_USER,
  secretKey: process.env.MINIO_PASS,
};

export const staticsBucketConfig = {
  name: 'media',
  ttl: 24 * 60 * 60, //1d
};
