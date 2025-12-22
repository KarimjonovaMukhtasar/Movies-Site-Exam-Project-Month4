import { ApiProperty } from "@nestjs/swagger";
import { SubscriptionType } from "@prisma/client";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateMovieDto {
  @ApiProperty({ type: "string", required: true, example: "Qasoskorlar" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: "string",
    required: true,
    example: "AJOYIB FANTASTIK KINO"
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: "number", required: true, example: "2025" })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  release_year: number;

  @ApiProperty({ type: "number", required: true, example: "120" })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  duration_minutes: number;

  @ApiProperty({ type: "number", required: true, example: "5" })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ type: "string", required: true, example: "free" })
  @IsEnum(SubscriptionType)
  @IsNotEmpty()
  subscription_type: SubscriptionType;

  @ApiProperty({
    type: "string",
    required: true,
    format: "binary",
    example: "avatar.jpeg"
  })
  poster_url: any;
}
