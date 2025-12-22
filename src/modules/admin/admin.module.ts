import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:  [AuthModule, JwtModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
