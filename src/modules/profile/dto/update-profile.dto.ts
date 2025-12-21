import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateProfileDto {
  @ApiProperty({ type: "string", required: false, example: "Ali Valiyev" })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === "" ? undefined : value))
  username: string;

  @ApiProperty({ type: "string", required: false, example: "ali@gmail.com" })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => (value === "" ? undefined : value))
  email: string;

  @ApiProperty({ type: "string", required: false, example: "password123" })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === "" ? undefined : value))
  password_hash: string;

  @ApiProperty({
    type: "string",
    required: false,
    format: "binary",
    example: "avatar.jpeg"
  })
  @IsOptional()
  avatar_url: any;
}
