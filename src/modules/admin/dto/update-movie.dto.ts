import { ApiProperty } from "@nestjs/swagger";
import { SubscriptionType } from "@prisma/client";
import { Transform } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

const toOptionalNumber = ({ value }) => {
  if (value === undefined || value === null || value === "" || value === "undefined") {
    return undefined;
  }
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

export class UpdateMovieDto {
  @ApiProperty({ required: false, example: "Qasoskorlar" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, example: "AJOYIB FANTASTIK KINO" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, example: 2025 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  release_year?: number;

  @ApiProperty({ required: false, example: 120 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  duration_minutes?: number;

  @ApiProperty({ required: false, example: 5 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ required: false, example: "free" })
  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : value))
  @IsEnum(SubscriptionType)
  subscription_type?: SubscriptionType;

   @ApiProperty({
    type: "string",
    required: true,
    format: "binary",
    example: "avatar.jpeg"
  })
  poster_url?: any;
}
