import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import  cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix("api/v1");
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true
    })
  )
  const config = new DocumentBuilder()
    .setTitle("MOVIES SITE PROJECT")
    .setDescription("Amazing site to watch movies")
    .setVersion("1.0")
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        name: 'accessToken',
        in: 'cookie',
      },
      'cookie-auth-key',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true
    }
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
