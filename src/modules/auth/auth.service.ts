import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "nestjs-cloudinary";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { MailerService } from "src/mailer/mailer.service";
import * as otpGenerator from "otp-generator";
import type { Response } from "express";
import { RedisService } from "../redis/redis.service";
import { OtpDto } from "./dto/otp.dto";
import { resendDto } from "./dto/resend.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService
  ) {}
  async register(registerDto: RegisterDto, avatar: Express.Multer.File) {
    try {
      const checkDuplicate = await this.prisma.users.findUnique({
        where: { email: registerDto.email, username: registerDto.username }
      });
      if (checkDuplicate) {
        throw new ConflictException(
          "THIS EMAIL OR USERNAME HAS ALREADY REGISTERED!"
        );
      }
      const avatarUrl = (await this.cloudinary.uploadFile(avatar)).url;
      const hashedPassword = await bcrypt.hash(registerDto.password_hash, 10);
      const newUser = await this.prisma.users.create({
        data: {
          ...registerDto,
          password_hash: hashedPassword,
          avatar_url: avatarUrl,
          status: "inactive"
        }
      });
      return {
        success: true,
        message: "Ro'yxatdan muvaffaqiyatli o'tdingiz",
        data: {
          user_id: newUser.id,
          username: newUser.username,
          role: newUser.role,
          created_at: newUser.created_at
        }
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async login(loginDto: LoginDto, res: Response) {
    try {
      const checkUser = await this.prisma.users.findUnique({
        where: { email: loginDto.email },
        include: { user_subscriptions: { include: { plan: true } } }
      });
      if (!checkUser) {
        throw new NotFoundException("THIS USER HAS NOT REGISTERED YET!");
      }
      const password = loginDto.password_hash;
      const checkPassword = await bcrypt.compare(
        password!,
        checkUser.password_hash
      );
      if (!checkPassword) {
        throw new BadRequestException("PASSWORD OR EMAIL IS INCORRECT!");
      }
      const { id, username, role, user_subscriptions } = checkUser;
      const activeSubscription = user_subscriptions?.find(
        (sub) => sub.status === "active"
      );
      const newOtp = await otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
      });
      await this.mailerService.sendEmail(
        checkUser.email,
        "OTP FOR VERIFICATION",
        newOtp
      );
      await this.redisService.set(checkUser.email, newOtp, 600);
      return {
        success: true,
        message: "Muvaffaqiyatli kirildi",
        data: {
          user_id: id,
          username,
          role,
          subscription: {
            plan_name: activeSubscription?.plan?.name ?? "Free",
            expires_at: activeSubscription?.end_date ?? null
          }
        }
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async verify(Otp: OtpDto, res: Response) {
    const { email, otp } = Otp;
    const checkOtp = await this.redisService.get(email);
    if (!checkOtp) {
      return {
        success: false,
        message: `THIS OTP DOESNOT EXIST OR EXPIRED, RETRY WITH LOGIN AGAIN`
      };
    }
    if (checkOtp !== otp) {
      return {
        success: false,
        message: `INVALID OTP!`
      };
    }
    const newUser = await this.prisma.users.findUnique({ where: { email } });
    if (!newUser) throw new BadRequestException(`THIS EMAIL NOT FOUND!`);
    const user = await this.prisma.users.update({
      where: { id: newUser.id },
      data: { ...newUser, status: "active" }
    });
    await this.redisService.del(email);
    const accessToken = await this.jwtService.signAsync(
      { id: user.id, role: user.role, email: user.email },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: "7d"
      }
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: user.id, role: user.role, email: user.email },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: "30d"
      }
    );
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "strict"
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "strict"
    });
    return {
      success: true,
      message: `SUCCESSFULLY VERIFIED THE OTP!`,
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  async resendOtp(payload: resendDto, res: Response) {
    const { email } = payload;
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user) throw new BadRequestException(`THIS EMAIL NOT FOUND!`);
    if (user.status === "active")
      throw new BadRequestException(`THIS USER HAS ALREADY BEEN VERIFIED`);
    const newOtp = await otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });
    await this.mailerService.sendEmail(
      user.email,
      "OTP FOR VERIFICATION",
      newOtp
    );
    await this.redisService.del(user.email);
    await this.redisService.set(user.email, newOtp, 600);
    return {
      success: true,
      message: `SUCCESSFULLY SENT THE NEW OTP TO THE EMAIL!`
    };
  }

  async refresh(req: Request, res: Response) {
    const refresh_token = req["cookies"].refresh_token;
    if (!refresh_token) {
      throw new UnauthorizedException("YOU HAVE NOT BEEN AUTHORIZED YET!");
    }
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET
      });
    } catch (error) {
      throw new UnauthorizedException("REFRESH TOKEN IS INVALID OR EXPIRED");
    }
    const user = await this.prisma.users.findUnique({
      where: { id: payload.id }
    });

    if (!user) {
      throw new NotFoundException("THIS USER CANNOT BE FOUND!");
    }
    const accessToken = await this.jwtService.signAsync(
      { id: user.id, role: user.role, email: user.email },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: "7d"
      }
    );

    const refreshToken = await this.jwtService.signAsync(
      { id: user.id, role: user.role, email: user.email },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: "30d"
      }
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "strict"
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "strict"
    });

    return {
      success: true,
      message: "SUCCESSFULLY REFRESHED THE TOKENS!",
      tokens: { accessToken, refreshToken }
    };
  }

  async logout(req: Request, res: Response) {
    const refresh_token = req["cookies"].refresh_token;
    if (!refresh_token) {
      throw new UnauthorizedException("YOU HAVE NOT BEEN AUTHORIZED YET!");
    }
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET
      });
    } catch (error) {
      throw new UnauthorizedException("REFRESH TOKEN IS INVALID OR EXPIRED");
    }
    const user = await this.prisma.users.findUnique({
      where: { id: payload.id }
    });
    if (!user) {
      throw new NotFoundException("THIS USER CANNOT BE FOUND!");
    }
    await this.prisma.users.update({
      where: { id: user.id },
      data: { status: "inactive" }
    });
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "strict"
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "strict"
    });
    return {
      success: true,
      message: `SUCCESSFULLY LOGGED OUT!`
    };
  }
}
