import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(
    page?: number,
    limit?: number,
    search?: string,
    category?: string,
    subscription_type?: string
  ) {
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

    if (subscription_type) {
      where.subscription_type = subscription_type;
    }

    if (category) {
      where.movie_categories = {
        some: { name: category }
      };
    }
    where.status = 'active'
    const [data, total] = await Promise.all([
      this.prisma.movies.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          movie_categories: {
            select: {
              categories: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }),
      this.prisma.movies.count({ where })
    ]);
    const formattedData = data.map((movie) => ({
      ...movie,
      categories: movie.movie_categories.map((mc) => mc.categories.name),
      movie_categories: undefined
    }));
    return {
      success: true,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      formattedData
    };
    } catch (error) {
        throw error
    }
  }

  async findOne(slug: string, req: Request) {
    try {
    const user_id = req['user'].id
    const movie= await this.prisma.movies.findUnique({where: {slug}, include: {
      movie_categories: {
        select: {
          categories: {select: {name: true}}
        },
      },
          movie_files: true,
          reviews: true,
          favorites: user_id ? {where: {user_id}} : false
    }})
    if(!movie){
      throw new NotFoundException(`THIS SLUG DOESN'T EXIST IN MOVIES DATABASE`)
    }
    const formatted = {
      id: movie.id,
      title: movie.title,
      slug: movie.slug,
      description: movie.description,
      release_year: movie.release_year,
      duration_minutes: movie.duration_minutes,
      poster_url: movie.poster_url,
      rating: Number(movie.rating),
      subscription_type: movie.subscription_type,
      view_count: movie.view_count,
      is_favorite: user_id ? movie.favorites.length > 0 : false,
      categories: movie.movie_categories.map(mc => mc.categories.name),
      files: movie.movie_files.map(f => ({
        quality: f.quality,
        language: f.language,
      })),
     reviews: {
      average_rating:
        movie.reviews.length > 0
          ? Number(
              (
                movie.reviews.reduce((sum, r) => sum + r.rating, 0) /
                movie.reviews.length
              ).toFixed(1)
            )
          : 0,
      count: movie.reviews.length
    }
    }
    return {
      success: true,
      data: formatted
    };
  } catch (error) {
      throw error
    }}

}
