import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRecipeDto {
  @ApiProperty({
    description: 'The name of the recipe',
  })
  @Length(3, 100, { message: ' Название должно содержать от 3 до 100 символов' })
  name: string;

  @ApiProperty({
    description: 'The category of the recipe',
  })
  @IsIn([
    'snacks',
    'salads',
    'soups',
    'fish',
    'meat',
    'garnish',
    'desserts',
    'drinks',
    'kids',
  ])
  category: string;

  @ApiProperty({
    description: 'The hours of cooking the recipe',
  })
  @IsInt()
  @Type(() => Number)
  @Min(0, { message: ' Количество часов приготовления должно быть не менее 0' })
  @Max(24, { message: ' Количество часов приготовления должно быть не больше 24' })
  hours: number;

  @ApiProperty({
    description: 'The minutes of cooking the recipe',
  })
  @IsInt()
  @Type(() => Number)
  @Min(0, { message: ' Количество минут приготовления должно быть не менее 0' })
  @Max(59, { message: ' Количество минут приготовления должно не быть больше 59' })
  minutes: number;

  @ApiProperty({
    description: 'The number of portions of the finished dish',
  })
  @IsInt()
  @Type(() => Number)
  @Min(1, { message: ' Количество порций должно быть не менее 1' })
  @Max(24, { message: ' Количество порций должно быть не более 24' })
  portions: number;

  @ApiProperty({ 
    description: 'The image of the recipe',
    type: 'string', format: 'binary', required: false })
  image: Express.Multer.File;
}
