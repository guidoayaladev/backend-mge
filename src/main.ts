import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    console.log('✅ Conexión a la base de datos establecida');
  } else {
    console.error('❌ Error: La conexión a la base de datos no se inicializó');
    process.exit(1);
  }

  const origin = process.env.CORS_ORIGIN ?? 'http://localhost:4200';
  app.enableCors({
    origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });


  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 App escuchando en http://localhost:${port}`);
}
bootstrap();
