import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow('APP_PORT') || 3000;

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Multi User Task Management API')
    .setDescription('The is a Multi-User Task Management API')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://localhost:${PORT}`, 'Development Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  logger.log(`App is listening on :${PORT}`);
}
bootstrap();
