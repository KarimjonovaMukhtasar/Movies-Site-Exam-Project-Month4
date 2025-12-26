import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiOperation, ApiParam, ApiSecurity } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('movies')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiSecurity("cookie-auth-key")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "{ USER, ADMIN, SUPERADMIN}" })
    @ApiParam({
      name: "movie_id",
      type: String,
      description: "MOVIE ID",
      required: true
    })
    @Post(`:movie_id/reviews`)
    create(@Param("movie_id") movie_id: string, @Req() req: Request, @Body() payload: CreateReviewDto) {
      return this.reviewsService.create(movie_id, req, payload);
    }

 

  @ApiSecurity("cookie-auth-key")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "{ USER, ADMIN, SUPERADMIN}" })
  @ApiParam({
    name: "movie_id",
    type: String,
    description: "MOVIE ID",
    required: true
  })
  @Delete(":movie_id/reviews/:review_id")
  remove(@Param("movie_id") movie_id: string, @Param("review_id") review_id: string, @Req() req: Request) {
    return this.reviewsService.remove(movie_id, review_id, req);
  }
}
