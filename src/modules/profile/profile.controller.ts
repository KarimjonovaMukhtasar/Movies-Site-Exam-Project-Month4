import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService, 
      private readonly 
  ) {}

  // @UseGuards(AuthGuard)
  // @ApiOperation({ summary: "{ USER, ADMIN, SUPERADMIN}" })
  // @Get()
  // profile( @Req() req: Request){
  //   const userId = req.user
  //   return this.profileService.profile(userId)
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }



}
