import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS so the Next.js frontend can connect
  app.enableCors({
    origin: 'http://localhost:3000', // Change this to your Next.js port if different
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Assuming your backend runs on port 3001
  await app.listen(3001); 
}
bootstrap();