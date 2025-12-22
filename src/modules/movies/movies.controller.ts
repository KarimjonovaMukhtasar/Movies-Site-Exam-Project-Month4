import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req
} from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { ApiOperation, ApiQuery, ApiSecurity } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiSecurity("cookie-auth-key")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "{ USER, ADMIN, SUPERADMIN}" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: Number })
  @ApiQuery({ name: "category", required: false, type: String })
  @ApiQuery({ name: "subscription_type", required: false, type: String })
  @Get("plans")
  findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("search") search?: string,
    @Query("category") category?: string,
    @Query("subscription_type") subscription_type?: string
  ) {
    return this.moviesService.findAll(
      page,
      limit,
      search,
      category,
      subscription_type
    );
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string, @Req() req: Request) {
    return this.moviesService.findOne(slug, req);
  }

}
