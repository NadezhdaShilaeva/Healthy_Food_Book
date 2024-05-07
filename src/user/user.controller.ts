import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Redirect,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from './dto/get-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UnauthorizedExceptionFilter } from 'src/filters/unauthorized-exception.filter';
import { ForbiddenExceptionFilter } from 'src/filters/forbidden-exception.filter';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from './entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Users')
@Controller('users')
@UseFilters(UnauthorizedExceptionFilter, ForbiddenExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Create a guest user',
  })
  @ApiResponse({
    status: 201,
    description: 'The guest user has been successfully created.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error creating guest. User with such email already exists.',
  })
  @Post('create-guest')
  @Redirect('/profile', 301)
  async createUserGuest(@Res() res, @Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUserGuest(createUserDto);

    const cookie = await this.authService.login(user);
    await res.setHeader('Set-Cookie', cookie);
  }

  @ApiOperation({
    summary: 'Create a moderator user',
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 201,
    description: 'The moderator user has been successfully created.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admin can create a moderator user.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error creating moderator. User with such email already exists.',
  })
  @Post('create-moderator')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createUserModerator(@Body() createUserDto: CreateUserDto) {
    await this.userService.createUserModerator(createUserDto);
  }

  @ApiOperation({
    summary: 'Find users with moderator role',
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Users with role moderator have been successfully found.',
    type: GetUserDto,
    isArray: true,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admin can view the list of moderators.',
  })
  @Get('/users/moderators')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findModerators(): Promise<GetUserDto[]> {
    return await this.userService.getModerators();
  }

  @ApiOperation({
    summary: 'Update user data such as username and email',
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authorized. Only authorized users can update their data.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error finding user. User with such id does not exists.',
  })
  @Patch('update')
  @UseGuards(JwtAuthGuard)
  async update(
    @Req() { user },
    @Body() updateUserDto: UpdateUserDto
  ) {
    await this.userService.update(user.id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Delete user by id',
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully removed.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authorized users can delete their account.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error finding user. User with such id does not exists.',
  })
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  @Redirect('/entrance', 301)
  async remove(@Req() req, @Res() res) {
    await this.userService.delete(req.user.id);
    
    const cookie = await this.authService.logout();
    await res.setHeader('Set-Cookie', cookie);

    req.session.destroy();
  }
}
