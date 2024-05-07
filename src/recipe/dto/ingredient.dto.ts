import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, Length, Max, Min } from 'class-validator';

export class IngredientDto {
  @ApiProperty({
    description: 'The name of the ingredient',
  })
  @Length(2, 100, { message: ' Название каждого ингредиента должно содержать от 2 до 100 симолов' })
  name: string;

  @ApiProperty({
    description: 'The amount of the ingredient to cooking the dish',
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0.1, { message: ' Количество каждого ингредиента должно быть не менее 0.1' })
  @Max(999, { message: ' Количество каждого ингредиента должно быть не более 999' })
  amount: number;

  @ApiProperty({
    description: 'The measurement type of the ingredient',
  })
  @IsIn(['g', 'kg', 'l', 'ml', 'teas', 'tables', 'piece', 'glass'])
  measurement: string;
}
