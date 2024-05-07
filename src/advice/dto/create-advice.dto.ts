import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class CreateAdviceDto {
  @ApiProperty({
    description: 'The description of the advice',
  })
  @Length(8, 200, { message: ' Описание должно содержать от 8 до 200 символов' })
  description: string;

  @ApiProperty({
    description: 'The image of the advice',
    type: 'string', format: 'binary', required: true })
  image: Express.Multer.File;
}