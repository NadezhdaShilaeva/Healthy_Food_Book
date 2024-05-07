import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, Length } from 'class-validator';
import { Role } from '../entities/user.entity';

export class GetUserDto {
  @ApiProperty({
    description: 'The id of the user',
  })
  id: number;

  @ApiProperty({
    description: 'The username of the user',
  })
  @Length(2, 30)
  username: string;

  @ApiProperty({
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The user role',
  })
  @IsIn(['admin', 'moderator', 'guest'])
  role: Role;
}
