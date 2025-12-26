import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService){}

  async findAll(req: Request , page?: number, limit?: number, search?: string) {
  try {
    const userId = req['user'].id
     if(!userId){
      throw new NotFoundException(`NOT FOUND SUCH A USER ID!`)
     } 
     const movies = await this.prisma.movies.findMany({where: {favorites: {some: {user_id: userId}}}})
      return {
       success: true,
       data: movies,
       total: movies.length
       }
     }catch (error) {
    throw error
  }}
   

  async create(movieId: string, req: Request) {
    const userId = req['user'].id
     if(!userId){
      throw new NotFoundException(`NOT FOUND SUCH A USER ID!`)
     }
     const movieCheck = await this.prisma.movies.findFirst({where: {id: movieId, status: 'active'}})
     if(!movieCheck){
      throw new BadRequestException(`THIS MOVIE ID DOESN'T EXIST OR INACTIVE FILM ID!`)
     }
     const isExists = await this.prisma.favorites.findFirst({where: {user_id: userId, movie_id: movieId}, include: {movies: true}})
     if(isExists){
       await this.prisma.favorites.delete({where: {id: isExists.id}})
       return {
        success: true,
        message: `THIS MOVIE HAS ALREADY BEEN ADDED TO FAVORITES, SO REMOVED/UNSTARRED NOW!`
       }
     }
     const favorite = await this.prisma.favorites.create({data: {user_id: userId, movie_id: movieId}, include: {movies: true}})
     console.log(favorite.movies.title)
     return {
       success: true,
       message: "Kino sevimlilar ro'yxatiga qo'shildi",
       data: {
         id: favorite.id,
         movie_id: movieId,
         movie_title:  favorite.movies.slug,
         created_at: favorite.created_at
       }
     }
  }

  async remove(movieId: string, req: Request) {
    const userId = req['user'].id
     if(!userId){
      throw new NotFoundException(`NOT FOUND SUCH A USER ID!`)
     }
     const movieCheck = await this.prisma.movies.findUnique({where: {id: movieId, status: 'active'}})
     if(!movieCheck){
      throw new BadRequestException(`THIS MOVIE ID DOESN'T EXIST OR INACTIVE FILM ID!`)
     }
     const isExists = await this.prisma.favorites.findFirst({where: {user_id: userId, movie_id: movieId}})
     if(isExists){
       await this.prisma.favorites.delete({where: {id: isExists.id}})
       return {
        success: true,
        message: "Kino sevimlilar ro'yxatidan o'chirildi"
       }
     }else{
      throw new BadRequestException(`THIS MOVIE HAS NOT BEEN ADDED TO FAVORITES LIST YET!`)
     }
  }
}
