import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Query,
  Put,
  Req
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { UserRoles } from "src/decarators/roles.decarator";
import { Roles } from "src/decarators/role.enum";
import {
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity
} from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { UploadFileDto } from "./dto/upload-file.dto";

@Controller("admin/movies")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiSecurity("cookie-auth-key")
  @UseGuards(AuthGuard, RoleGuard)
  @UserRoles(Roles.admin, Roles.superadmin)
  @ApiOperation({ summary: "{ ADMIN, SUPERADMIN}" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: Number })
  @Get()
  findAll( @Query("page") page?: number,
      @Query("limit") limit?: number,
      @Query("search") search?: string,) {
    return this.adminService.findAll(page, limit, search);
  }

  @ApiSecurity("cookie-auth-key")
  @UseGuards(AuthGuard, RoleGuard)
  @UserRoles(Roles.admin, Roles.superadmin)
  @ApiOperation({ summary: "{ ADMIN, SUPERADMIN}" })
  @ApiConsumes("multipart/form-data")
  @Post()
  @UseInterceptors(
    FileInterceptor("poster_url", {
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException("Only image files are allowed!"),
            false
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }
    })
  )
  create(
    @Req() req: Request,
    @UploadedFile() poster_url: Express.Multer.File,
    @Body() createMovieDto: CreateMovieDto
  ) {
    return this.adminService.create(req, poster_url, createMovieDto);
  }


  @ApiSecurity("cookie-auth-key")
  @UseGuards(AuthGuard, RoleGuard)
  @UserRoles(Roles.admin, Roles.superadmin)
  @ApiOperation({ summary: "{ ADMIN, SUPERADMIN}" })
  @ApiConsumes("multipart/form-data")
   @ApiParam({
    name: 'movie_id',   
    type: String,   
    description: 'Movie ID',
    required: true       
  })
  @UseInterceptors(
    FileInterceptor("poster_url", {
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException("Only image files are allowed!"),
            false
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }
    })
  )
  @Put(":movie_id")
  update(@Param("movie_id") movie_id: string, @Body() updateMovieDto: UpdateMovieDto, @UploadedFile() poster_url: Express.Multer.File) {
    return this.adminService.update(movie_id, updateMovieDto, poster_url);
  }


  @ApiSecurity("cookie-auth-key")
  @UseGuards(AuthGuard, RoleGuard)
  @UserRoles(Roles.admin, Roles.superadmin)
  @ApiOperation({ summary: "{ ADMIN, SUPERADMIN}" })
  @ApiParam({
    name: 'movie_id',   
    type: String,   
    description: 'Movie ID',
    required: true       
  })
  @Delete(":movie_id")
  remove(@Param("movie_id") movie_id: string) {
    return this.adminService.remove(movie_id);
  }



  @ApiSecurity("cookie-auth-key")
  @UseGuards(AuthGuard, RoleGuard)
  @UserRoles(Roles.admin, Roles.superadmin)
  @ApiOperation({ summary: "{ ADMIN, SUPERADMIN}" })
  @ApiConsumes("multipart/form-data")
  @ApiParam({
    name: 'movie_id',   
    type: String,   
    description: 'Movie ID',
    required: true       
  })
  @Post(':movie_id/files')
  @UseInterceptors(
    FileInterceptor("file_url", {
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(mp4|mkv|webm|mov)$/)) {
          return cb(
            new BadRequestException("Only video files are allowed!"),
            false
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 500 * 1024 * 1024 }
    })
  )
  uploadFile(
    @Param() movie_id: string,
    @UploadedFile() file_url: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto
  ) {
    return this.adminService.uploadFile(movie_id, file_url, uploadFileDto);
  }

}
