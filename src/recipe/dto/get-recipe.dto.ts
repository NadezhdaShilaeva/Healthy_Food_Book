import { IngredientDto } from './ingredient.dto';
import { CookingStepDto } from './cooking-step.dto';
import { ImageDto } from './image.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsInstance,
  IsInt,
  Length,
  Max,
  Min,
} from 'class-validator';
import { GetUserDto } from 'src/user/dto/get-user.dto';

export class GetRecipeDto {
  @ApiProperty({
    description: 'The id of the recipe',
  })
  id: number;

  @ApiProperty({
    description: 'The name of the recipe',
  })
  @Length(3, 100)
  name: string;

  @ApiProperty({
    description: 'The category of the recipe',
  })
  @Length(4, 20)
  category: string;

  @ApiProperty({
    description: 'The hours of cooking the recipe',
  })
  @IsInt()
  @Min(0)
  @Max(24)
  hours: number;

  @ApiProperty({
    description: 'The minutes of cooking the recipe',
  })
  @IsInt()
  @Min(0)
  @Max(59)
  minutes: number;

  @ApiProperty({
    description: 'The number of portions of the finished dish',
  })
  @IsInt()
  @Min(1)
  @Max(24)
  portions: number;

  @ApiProperty({
    description: 'Ingredients of cooking the recipe',
  })
  @ArrayNotEmpty()
  ingredients: IngredientDto[];

  @ApiProperty({
    description: 'Cooking steps of the recipe',
  })
  @ArrayNotEmpty()
  cookingSteps: CookingStepDto[];

  @ApiProperty({
    description: 'The author of the recipe',
  })
  @IsInstance(GetUserDto)
  author: GetUserDto;

  @ApiProperty({
    description: 'The image of the recipe',
  })
  @IsInstance(ImageDto)
  image: ImageDto;

  @ApiProperty({
    description: 'The count of recipe likes',
  })
  @IsInt()
  @Min(0)
  likes: number;

  @ApiProperty({
    description: 'Is the recipe in current user favourites',
  })
  isLiked: boolean;
}
