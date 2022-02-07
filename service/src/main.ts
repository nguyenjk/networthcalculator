import { ValidationPipe, LoggerService } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const appOptions = {
    cors: true,
  };
  const app = await NestFactory.create(AppModule, appOptions);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //     whitelist: true,
  //   }),
  // );

  const config = new DocumentBuilder()
    .setTitle('networth calculator service')
    .setDescription('The networth api')
    .setVersion('1.0')
    .addTag('services')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
