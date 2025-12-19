import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "nestjs-cloudinary";
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt";
import { MailerService } from "src/mailer/mailer.service";


@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ){}

  async register(registerDto: RegisterDto, avatar: Express.Multer.File) {
      try{
        const checkDuplicate = await this.prisma.users.findUnique({
          where: {email: registerDto.email, username: registerDto.username}
        })
        if(checkDuplicate){
          throw new ConflictException('THIS EMAIL OR USERNAME HAS ALREADY REGISTERED!')
        }
        const avatarUrl = (await this.cloudinary.uploadFile(avatar)).url;
        const hashedPassword = await bcrypt.hash(registerDto.password_hash, 10)
        const newUser = await this.prisma.users.create({
          data: {...registerDto, password_hash: hashedPassword,  avatar_url: avatarUrl, status: 'inactive'}
        })
        return {
          success: true,
          message: "Ro'yxatdan muvaffaqiyatli o'tdingiz",
          data: {
         user_id: newUser.id,
         username: newUser.username,
         role: newUser.role,
         created_at: newUser.created_at
       }
        }
      }catch(err){
        console.log(err)
        throw err
      }
  }

  async login(loginDto: LoginDto){
    try {
        const checkUser = await this.prisma.users.findUnique({
          where: {email: loginDto.email}
        })
        if(!checkUser){
          throw new NotFoundException('THIS USER HAS NOT REGISTERED YET!')
        }
        const password = loginDto.password_hash
        const checkPassword = await bcrypt.compare(password!, checkUser.password_hash)
        if(!checkPassword){
          throw new BadRequestException('PASSWORD OR EMAIL IS INCORRECT!')
        }
  
    } catch (err) {
      console.log(err)
        throw err
    }
  }

}
