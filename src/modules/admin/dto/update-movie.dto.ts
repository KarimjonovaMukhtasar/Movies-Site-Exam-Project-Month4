import { ApiProperty } from "@nestjs/swagger";
import { SubscriptionType } from "@prisma/client";
import { Transform } from "class-transformer";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from "class-validator";

export class UpdateMovieDto {
  @ApiProperty({ type: "string", required: true, example: "Qasoskorlar" })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : value))
  title: string;

  @ApiProperty({
    type: "string",
    required: true,
    example: "AJOYIB FANTASTIK KINO"
  })
  @IsString()
 @IsOptional()
   @Transform(({ value }) => (value === "" ? undefined : value))
  description: string;

  @ApiProperty({ type: "number", required: true, example: "2025" })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : value))
  release_year: number;

  @ApiProperty({ type: "number", required: true, example: "120" })
  @IsNumber()
  @IsPositive()
 @IsOptional()
   @Transform(({ value }) => (value === "" ? undefined : value))
  duration_minutes: number;

  @ApiProperty({ type: "number", required: true, example: "5" })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : value))
  rating: number;

  @ApiProperty({ type: "string", required: true, example: "free" })
  @IsEnum(SubscriptionType)
  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : value))
  subscription_type: SubscriptionType;

  @ApiProperty({
    type: "string",
    required: true,
    format: "binary",
    example: "avatar.jpeg"
  })
  @IsOptional()
@Transform(({ value }) => (value === "" ? undefined : value))
  poster_url: any;
}

