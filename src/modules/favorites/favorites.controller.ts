import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
  Query
} from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { ApiOperation, ApiParam, ApiQuery, ApiSecurity } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiSecurity("cookie-auth-key")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "{ USER, ADMIN, SUPERADMIN}" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: Number })
  @ApiParam({
    name: "movie_id",
    type: String,
    description: "MOVIE ID",
    required: true
  })
  @Get()
  findAll(
    @Query() page: number,
    limit: number,
    search: string,
    @Req() req: Request
  ) {
    return this.favoritesService.findAll(req, page, limit, search, );
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
  @Post(`:movie_id`)
  create(@Param("movie_id") movie_id: string, @Req() req: Request) {
    return this.favoritesService.create(movie_id, req);
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
  @Delete(":movie_id")
  remove(@Param("movie_id") movie_id: string, @Req() req: Request) {
    return this.favoritesService.remove(movie_id, req);
  }
}
