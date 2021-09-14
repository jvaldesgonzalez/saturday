import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 80;

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(morgan('dev'));
  app.use(helmet());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Saturday Backend')
    .setDescription('Saturday apps API description')
    .setVersion('0.0.1')
    .addTag('users')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  Logger.log(`🚀 Server running on port :${port}`, 'NestApplication');
}
bootstrap();
