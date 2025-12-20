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
import type {Response, Request } from "express"
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import {  ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { OtpDto } from "./dto/otp.dto";
import { AuthGuard } from "src/guards/auth.guard";

@ApiTags("Auth")
@Controller("Auth")
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

  // @ApiOperation({ summary: "{ USER, ADMIN, SUPERADMIN}" })
  // @Post('refresh')
  // refresh(@Req() req: Request, @Res({passthrough: true}) res: Response){
  //   const refreshToken = req.cookies['refresh_token']
  //   return this.authService.refresh(refreshToken, res)
  // }
}
