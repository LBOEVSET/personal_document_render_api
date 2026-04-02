import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { requestIdMiddleware } from './common/middleware/request-id.middleware';
import { RequestContextService } from './common/middleware/request-context.service';
import { LoggingInterceptor } from './core/logger/logging.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ 
    origin: false,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept"
    ],
  });

  // Enable shutdown hooks
  app.enableShutdownHooks();

  // Enable API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(app.get(LoggingInterceptor));

  const requestContext = app.get(RequestContextService);
  app.use(requestIdMiddleware(requestContext));

  app.use(
    bodyParser.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Prison API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log(`Application is running on port: ${process.env.PORT || 3000}`);
}
bootstrap();
