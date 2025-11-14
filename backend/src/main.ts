import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Middleware
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
}

bootstrap();
