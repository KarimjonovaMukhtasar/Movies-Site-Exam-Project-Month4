import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
  @ApiProperty({ type: "string", required: true, example: "Juda zo'r film, tavsiya qilaman" })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    type: "number",
    required: true,
    example: 5
  })
  @IsNumber()
  @IsNotEmpty()
  @Max(5)
  @Min(1)
  rating: number;
}
