import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The username of the user',
  })
  @Length(2, 30, { message: ' Имя пользователя должно содержать от 2 до 30 символов' })
  username: string;

  @ApiProperty({
    description: 'The email of the user',
  })
  @IsEmail({}, { message: ' Email должен быть действительным электронным почтовым адресом' })
  email: string;
}
