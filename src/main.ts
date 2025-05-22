import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🧠 Inicialización base de datos
  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    console.log('✅ Conexión a la base de datos establecida');
  } else {
    console.error('❌ Error: La conexión a la base de datos no se inicializó');
    process.exit(1);
  }

  // 🛡️ Seguridad global
  app.use(
    helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }),
  );
  app.use(cookieParser());

  // 🌐 Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 🔐 CORS dinámico
  const origin = process.env.CORS_ORIGIN ?? '*';
  app.enableCors({
    origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 🚀 Inicio del servidor
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 App escuchando en http://localhost:${port}`);
}
bootstrap();
