import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule} from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { RedisModule } from '../redis/redis.module';


@Module({
  imports: [JwtModule.register({}),
    PrismaModule,
    MailerModule,
    RedisModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
