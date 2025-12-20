import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, MaxLength, MinLength, IsPositive, IsUUID, IsString } from "class-validator";

export class OtpDto{
    @ApiProperty({type: 'string', required: true, example: '123456'})
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    @IsNotEmpty()
    otp: string

    @ApiProperty({type: 'string', required: true})
    @IsString()
    @IsNotEmpty()
    email: string
}