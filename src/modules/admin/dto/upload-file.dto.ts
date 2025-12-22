import { ApiProperty } from "@nestjs/swagger";
import { Languages, Quality, Status } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UploadFileDto {
  @ApiProperty({
    type: "string",
    required: true,
    format: "binary",
    example: "avatar.jpeg"
  })
  file_url: string;

  @ApiProperty({ type: "string", required: true, example: "240p" })
  @IsEnum(Quality)
  @IsNotEmpty()
  quality: Quality;

  @ApiProperty({ type: "string", required: true, example: "en" })
  @IsEnum(Languages)
  @IsNotEmpty()
  language: Languages;

  @ApiProperty({ type: "string", required: true, example: "active" })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
