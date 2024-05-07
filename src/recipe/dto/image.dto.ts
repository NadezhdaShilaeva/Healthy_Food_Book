import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ImageDto {
  @ApiProperty({
    description: 'The path to the image',
  })
  @IsString()
  path: string;
}
