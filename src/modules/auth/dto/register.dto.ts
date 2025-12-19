import { ApiProperty } from "@nestjs/swagger"
import { Status } from "@prisma/client"
import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator"
import { Roles } from "@prisma/client"

export class RegisterDto {
    @ApiProperty({type: 'string', required: true, example: "Ali Valiyev"})
    @IsString()
    @IsNotEmpty()
    username: string

    @ApiProperty({type: 'string', required: true, example: "ali@gmail.com"})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({type: 'string', required: true, example: "password123"})
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password_hash: string

    @ApiProperty({type: 'string', required: true, format: 'binary' , example: "avatar.jpeg"})
    avatar_url: any

}
