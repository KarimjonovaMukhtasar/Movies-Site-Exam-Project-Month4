import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService){}
  async create(movie_id: string, req: Request, payload: CreateReviewDto) {
    const movie = await this.prisma.movies.findUnique({where: {id: movie_id}})
    if(!movie) throw new NotFoundException(`THIS MOVID ID CANNOT BE FOUND FROM THE DATABASE!`)
    const user_id = req['user'].id
    if(!user_id) throw new BadRequestException(`NOT FOUND SUCH A USER ID!`)
    const review = await this.prisma.reviews.create({data: {user_id, movie_id, ...payload}, include: {users: true, movies: true}})
    return {
       success: true,
       message: "Sharh muvaffaqiyatli qo'shildi",
       data: {
         id: review.id,
         user: {
           id: review.users.id,
           username: review.users.username
         },
         movie_id: review.movie_id,
         rating: review.rating,
         comment: review.comment,
         created_at: review.created_at
       }
     }
;
  }

  
  
  async remove(movie_id: string, review_id:string, req: Request) {
    const movie = await this.prisma.movies.findUnique({where: {id: movie_id}})
    if(!movie) throw new NotFoundException(`THIS MOVID ID CANNOT BE FOUND FROM THE DATABASE!`)
    const user_id = req['user'].id
    if(!user_id) throw new BadRequestException(`NOT FOUND SUCH A USER ID!`)
    const review = await this.prisma.reviews.findFirst({where: {id: review_id, user_id, movie_id}})
    if(!review) throw new NotFoundException(`THIS REVIEW ID CANNOT BE FOUND FROM THE DATABASE!`)
    await this.prisma.reviews.delete({where: {id: review_id, user_id, movie_id}})
    return {
       success: true,
       message: "Sharh muvaffaqiyatli o'chirildi"
     }
  }
}
