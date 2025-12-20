import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
     @ApiProperty({type: 'string', required: true, example: "ali@gmail.com"})
        @IsEmail()
        @IsNotEmpty()
        email: string
    
        @ApiProperty({type: 'string', required: true, example: "password123"})
        @IsString()
        @IsNotEmpty()
        @MinLength(5)
        password_hash: string
}
