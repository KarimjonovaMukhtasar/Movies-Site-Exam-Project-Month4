import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";


export class resendDto{
       @ApiProperty({type: 'string', required: true, example: "ali@gmail.com"})
            @IsEmail()
            @IsNotEmpty()
            email: string
}