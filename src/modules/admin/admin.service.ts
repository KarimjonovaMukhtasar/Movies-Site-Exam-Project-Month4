import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UploadFileDto } from "./dto/upload-file.dto";
import { CloudinaryService } from "nestjs-cloudinary";
import { Quality } from "@prisma/client";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService
  ) {}
  async findAll(page?: number, limit?: number, search?: string) {
    try {
      page = Number(page) || 1;
      if (page < 0) {
        throw new BadRequestException(`INCORRECT PAGE NUMBER!`);
      }
      limit = Number(limit) || 10;
      if (limit < 0) {
        throw new BadRequestException(`INCORRECT LIMIT NUMBER!`);
      }
      const skip = (page - 1) * limit;
      const where: any = {};
      if (search) {
        where.title = { contains: search, mode: "insensitive" };
      }
      where.status = "active";
      const [data, total] = await Promise.all([
        this.prisma.movies.findMany({
          where,
          skip,
          take: limit,
          orderBy: { created_at: "desc" }
        }),
        this.prisma.movies.count({ where })
      ]);
      return {
        success: true,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        data
      };
    } catch (error) {
      throw error;
    }
  }

  async create(
    req: Request,
    poster_url: Express.Multer.File,
    createMovieDto: CreateMovieDto
  ) {
    try {
      const created_by = req["user"].id;
      const slug = createMovieDto.title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
      const checkDuplicate = await this.prisma.movies.findUnique({
        where: { slug }
      });
      if (checkDuplicate) {
        throw new ConflictException(
          `THIS MOVIE ALREADY EXISTS IN THE DATABASE!`
        );
      }
      const posterUrl = (await this.cloudinary.uploadFile(poster_url)).url;
      const newMovie = await this.prisma.movies.create({
        data: {
          ...createMovieDto,
          slug,
          poster_url: posterUrl,
          user: {
            connect: { id: created_by }
          }
        }
      });
      return {
        success: true,
        message: "Yangi kino muvaffaqiyatli qo'shildi",
        data: {
          id: newMovie.id,
          title: newMovie.title,
          slug: newMovie.slug,
          created_at: newMovie.created_at
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    movie_id: string,
    updateMovieDto: UpdateMovieDto,
    poster_url: Express.Multer.File
  ) {
    try {
      const movie = await this.prisma.movies.findUnique({
        where: { id: movie_id }
      });
      if (!movie) {
        throw new NotFoundException(
          `THIS MOVIE ID CANNOT BE FOUND FROM THE DATABASE!`
        );
      }
      if (updateMovieDto.title) {
        const checkTitle = await this.prisma.movies.findFirst({
          where: { title: updateMovieDto.title }
        });
        if (checkTitle)
          throw new ConflictException(`THIS TITLE HAS ALREADY BEEN CHOSEN!`);
      }
      if (poster_url) {
        updateMovieDto.poster_url = (
          await this.cloudinary.uploadFile(poster_url)
        ).url;
      }
      const updatedMovie = await this.prisma.movies.update({
        where: { id: movie_id },
        data: { ...updateMovieDto }
      });
      return {
        success: true,
        message: "Kino muvaffaqiyatli yangilandi",
        data: {
          id: updatedMovie.id,
          title: updatedMovie.title,
          updated_at: updatedMovie.updated_at
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(movie_id: string) {
    try {
      const movie = await this.prisma.movies.findUnique({
        where: { id: movie_id }
      });
      if (!movie) {
        throw new NotFoundException(
          `THIS MOVIE ID CANNOT BE FOUND FROM THE DATABASE!`
        );
      }
      await this.prisma.movies.update({
        where: { id: movie_id },
        data: { status: "inactive" }
      });
      return {
        success: true,
        message: "Kino muvaffaqiyatli o'chirildi"
      };
    } catch (error) {
      throw error;
    }
  }

  async uploadFile(
    movie_id: string,
    file_url: Express.Multer.File,
    uploadFile: UploadFileDto
  ) {
    try {
      const movie = await this.prisma.movies.findUnique({
        where: { id: movie_id }
      });
      if (!movie) {
        throw new NotFoundException(
          `THIS MOVIE ID CANNOT BE FOUND FROM THE DATABASE!`
        );
      }
      const fileUrl = (
        await this.cloudinary.uploadFile(file_url, {
          resource_type: "auto",
          folder: "movies"
        })
      ).secure_url;
      uploadFile.file_url = fileUrl;
      const newFile = await this.prisma.movie_files.create({
        data: {
          file_url: uploadFile.file_url,
          quality: uploadFile.quality,
          language: uploadFile.language,
          status: uploadFile.status,
          movies: { connect: { id: movie_id } }
        }
      });
      return {
        success: true,
        message: "Kino fayli muvaffaqiyatli yuklandi",
        data: {
          id: newFile.id,
          movie_id: newFile.movie_id,
          quality: newFile.quality,
          language: newFile.language,
          file_url: newFile.file_url
        }
      };
    } catch (error) {
      throw error;
    }
  }
}
