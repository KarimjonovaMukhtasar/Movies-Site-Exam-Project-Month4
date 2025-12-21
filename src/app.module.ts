import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { SubscriptionModule } from "./modules/subscription-plan/subscription-plan.module";
import { MoviesModule } from "./modules/movies/movies.module";
import { FavoritesModule } from "./modules/favorites/favorites.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { AdminModule } from "./modules/admin/admin.module";
import { FileUploadModule } from "./file-upload/file.upload.module";
import { CloudinaryModule } from "nestjs-cloudinary";
import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./modules/redis/redis.module";


@Module({
  imports: [
    AuthModule,
    ProfileModule,
    RedisModule,
    SubscriptionModule,
    MoviesModule,
    FavoritesModule,
    ReviewsModule,
    AdminModule,
    FileUploadModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CloudinaryModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        cloud_name: configService.get("CLOUD_NAME"),
        api_key: configService.get("API_KEY"),
        api_secret: configService.get("API_SECRET")
      })
    }),
    CloudinaryModule.forRoot({
  cloudinary_url: process.env.CLOUDINARY_URL,
})
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
