import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "nestjs-cloudinary";
import * as bcrypt from "bcrypt";

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinary: CloudinaryService
  ) {}
  async profile(req: Request) {
    const payload = req["user"];
    if (!payload) {
      throw new UnauthorizedException(`NOT AUTHORIZED YET!`);
    }
    const user = await this.prismaService.users.findUnique({
      where: { id: payload.id }
    });
    if (!user) {
      throw new NotFoundException(`NOT FOUND SUCH A USER IN THE DATABASE!`);
    }
    return {
      success: true,
      data: {
        user_id: user.id,
        full_name: user.username,
        email: user.email,
        created_at: user.created_at,
        status: user.status,
        role: user.role,
        avatar_url: user.avatar_url
      }
    };
  }
  async update(
    updateProfileDto: UpdateProfileDto,
    req: Request,
    avatar_url: Express.Multer.File
  ) {
    const payload = req["user"];
    if (!payload) {
      throw new UnauthorizedException(`NOT AUTHORIZED YET!`);
    }
    const user = await this.prismaService.users.findUnique({
      where: { id: payload.id }
    });
    if (!user) {
      throw new NotFoundException(`NOT FOUND SUCH A USER IN THE DATABASE!`);
    }
    if (updateProfileDto.email) {
      const checkDuplicate = await this.prismaService.users.findUnique({
        where: { email: updateProfileDto.email }
      });
      if (checkDuplicate)
        throw new ConflictException(
          `THIS USER EMAIL HAS ALREADY BEEN ADDED TO THE DATABASE`
        );
    }
    if (updateProfileDto.password_hash) {
      updateProfileDto.password_hash = await bcrypt.hash(
        updateProfileDto.password_hash,
        10
      );
    }
    if (avatar_url) {
      const { url } = await this.cloudinary.uploadFile(avatar_url);
      updateProfileDto.avatar_url = url;
    }
    const newUser = await this.prismaService.users.update({
      where: { id: user.id },
      data: { ...updateProfileDto }
    });
    return {
      success: true,
      message: "Profil muvaffaqiyatli yangilandi",
      data: {
        user_id: newUser.id,
        username: newUser.username,
        avatar_url: newUser.avatar_url,
        email: newUser.email,
        status: newUser.status,
        updated_at: newUser.updated_at
      }
    };
  }
}
