import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request as ExpressRequest , Response} from "express";

import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import {  ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { OtpDto } from "./dto/otp.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { resendDto } from "./dto/resend.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "{ USER }" })
  @ApiConsumes("multipart/form-data")
  @Post("register")
  @UseInterceptors(FileInterceptor("avatar_url", {
    storage: multer.memoryStorage(),
     fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return cb(new BadRequestException('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, 
  }))
  register(@UploadedFile() avatar: Express.Multer.File, @Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto, avatar);
  }


  @ApiOperation({ summary: "{ USER, ADMIN, SUPERADMIN}" })
  @Post('login')
  login(@Body() loginDto: LoginDto, @Res({passthrough: true}) res: Response){
    return this.authService.login(loginDto, res)
  }
  
  
  @ApiOperation({ summary: "{ USER, ADMIN, SUPERADMIN}" })
  @Post('verify')
  verifyOtp(@Body() Otp: OtpDto, @Res({passthrough: true}) res: Response){
    return this.authService.verify(Otp, res)
  }


  @ApiOperation({summary: "{USER, ADMIN, SUPERADMIN}"})
  @Post('resendOtp')
  resendOtp(@Body() payload: resendDto, @Res({passthrough: true}) res: Response){
    return this.authService.resendOtp(payload, res)
  }

  @ApiOperation({ summary: " {USER, ADMIN, SUPERADMIN}" })
  @UseGuards(AuthGuard)
  @Post('refresh')
  refresh(@Req() req: Request, @Res({passthrough:true}) res: Response){
    return this.authService.refresh(req, res)
  }

  @ApiOperation({ summary: " {USER, ADMIN, SUPERADMIN}" })
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Req() req: Request, @Res({passthrough:true}) res: Response){
    return this.authService.logout(req, res)
  }
}
