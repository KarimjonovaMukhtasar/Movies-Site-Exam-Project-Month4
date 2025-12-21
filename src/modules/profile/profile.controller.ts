import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Put, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { UploadedFile } from "@nestjs/common";

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService
  ) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "{ USER, ADMIN, SUPERADMIN}" })
  @Get()
  profile( @Req() req: Request){
    return this.profileService.profile(req)
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "{ USER, ADMIN, SUPERADMIN}" })
  @ApiConsumes("multipart/form-data")
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
  @Put()
  update(@Body() updateProfileDto: UpdateProfileDto, @Req() req: Request, @UploadedFile() avatar_url: Express.Multer.File) {
    return this.profileService.update(updateProfileDto, req, avatar_url);
  }
}
