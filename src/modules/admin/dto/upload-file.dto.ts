import { ApiProperty } from "@nestjs/swagger";
import { Languages, Quality, Status } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UploadFileDto {
  @ApiProperty({
    type: "string",
    required: true,
    format: "binary",
    example: "avatar.jpeg"
  })
  file_url: string;

  @ApiProperty({ type: "string", example: "p240" })
  @IsEnum(Quality) 
  @IsNotEmpty()
  quality: Quality;

  @ApiProperty({ enum: Languages, required: true, example: "en" })
  @IsEnum(Languages)
  @IsNotEmpty()
  language: Languages;

  @ApiProperty({ enum: Status, required: true, example: "active" })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
