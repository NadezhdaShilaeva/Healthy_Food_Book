import { ImageDto } from './image.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInstance, IsInt, Length, Max, Min } from 'class-validator';

export class RecipeCardDto {
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
    description: 'Is recipe in current user favourites',
  })
  isLiked: boolean;

  @ApiProperty({
    description: 'The state of recipe',
  })
  @IsIn(['created', 'approved'])
  state: string;
}
