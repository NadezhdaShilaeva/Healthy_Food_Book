import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Length, Max, Min } from 'class-validator';

export class CookingStepDto {
  @ApiProperty({
    description: 'The ordinal number of the cooking step',
  })
  @IsInt()
  @Type(() => Number)
  @Min(1, { message: ' Количество шагов приготовления должно быть не менее 1' })
  @Max(20, { message: ' Количество шагов приготовления должно быть не более 20' })
  number: number;

  @ApiProperty({
    description: 'The description of the cooking service',
  })
  @Length(1, 400, { message: ' Описание шага приготовления должно содержать от 1 до 400 символов' })
  description: string;
}
