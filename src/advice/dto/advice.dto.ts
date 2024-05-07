import { ImageDto } from '../../recipe/dto/image.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInstance, Length } from 'class-validator';

export class AdviceDto {
  @ApiProperty({
    description: 'The description of the advice',
  })
  @Length(8, 200, { message: ' Описание должно содержать от 8 до 200 символов' })
  description: string;

  @ApiProperty({
    description: 'The image of the advice',
  })
  @IsInstance(ImageDto)
  image: ImageDto;
}
