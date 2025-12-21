import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod, Status } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID
} from "class-validator";
import { Matches, Length } from 'class-validator';
import { ValidateNested } from 'class-validator';


export class CardDetailsDto {
  @IsString()
  @Matches(/^\d{4}X{8}\d{4}$/)
  card_number: string;

  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
  expiry: string;

  @IsString()
  @Length(3, 50)
  card_holder: string;
}

export class PaymentDto {
  @ApiProperty({ type: "string", required: true,})
  @IsUUID()
  @IsNotEmpty()
  plan_id: string;

  @ApiProperty({  required: false, example: "card" })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  payment_method: PaymentMethod;

  @ApiProperty({type: 'array', required: true, example: 'card_number: '})
  @ValidateNested()
  @Type(() => CardDetailsDto)
  payment_details: CardDetailsDto;

  @ApiProperty({type: 'boolean', required: false, example: "true"})
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : value))
  auto_renew: boolean;
}
