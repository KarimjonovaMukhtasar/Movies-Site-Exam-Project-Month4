import { ApiProperty } from "@nestjs/swagger";
import { Prisma, Status } from "@prisma/client";
import { Transform } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";

export class CreateSubscriptionDto {
  @ApiProperty({ type: "string", required: true, example: "BASIC" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: "number", required: true, example: "750.0" })
  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: "number", required: true, example: "30" })
  @IsNumber()
  @IsNotEmpty()
  duration_days: number;

  @ApiProperty({
    type: "array",
    required: true,
    example: "['SD sifatli kinolar', 'Reklama bilan']"
  })
  @IsArray()
  @IsNotEmpty()
  features: string[];


  // @ApiProperty({ type: "boolean", required: false, example: "true" })
  // @IsBoolean()
  // @IsOptional()
  // @Transform(({ value }) => (value === "" ? undefined : value))
  // is_active: Boolean;

  // @ApiProperty({  required: false, example: "active" })
  // @IsEnum(Status)
  // @IsOptional()
  // @Transform(({ value }) => (value === "" ? undefined : value))
  // status: Status;
}
