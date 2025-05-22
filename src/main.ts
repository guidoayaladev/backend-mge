import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { LoggerInterceptor } from './shared/interceptors/logger.interceptor'; // 👈 Asegúrate que exista esta ruta

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    logger.log('✅ Conexión a la base de datos establecida');
  } else {
    logger.error('❌ Error: La conexión a la base de datos no se inicializó');
    process.exit(1);
  }

  app.use(
    helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }),
  );
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new LoggerInterceptor());

  const origin = process.env.CORS_ORIGIN ?? '*';
  app.enableCors({
    origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 App escuchando en http://localhost:${port}`);
}
bootstrap();
