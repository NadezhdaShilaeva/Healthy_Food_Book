import { AdviceService } from './advice.service';
import { Body, Controller, Get, Post, Query, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdviceDto } from './dto/advice.dto';
import { ApiConsumes, ApiCookieAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAdviceDto } from './dto/create-advice.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UnauthorizedExceptionFilter } from 'src/filters/unauthorized-exception.filter';
import { ForbiddenExceptionFilter } from 'src/filters/forbidden-exception.filter';

@ApiTags(`Advices`)
@Controller('advices')
@UseFilters(UnauthorizedExceptionFilter, ForbiddenExceptionFilter)
export class AdviceController {
  constructor(private readonly adviceService: AdviceService) {}

  @ApiOperation({
    summary: 'Create an advice',
  })
  @ApiConsumes('multipart/form-data')
  @ApiCookieAuth()
  @ApiResponse({
    status: 201,
    description: 'The advice has been successfully created.',
    type: AdviceDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admin or moderators can create an advice.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error creating advice. Advice with such description already exists.',
  })
  @Post('create')
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() adviceDto: CreateAdviceDto, 
    @UploadedFile() image: Express.Multer.File
  ): Promise<AdviceDto> {
    return await this.adviceService.create(adviceDto, image);
  }

  @ApiOperation({
    summary: 'Get all advices',
  })
  @ApiQuery({ name: 'skip', type: 'number' })
  @ApiQuery({ name: 'take', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The advice has been successfully found.',
    type: AdviceDto,
    isArray: true,
  })
  @Get('find-all')
  async findAll(@Query('skip') skip: number, @Query('take') take: number): Promise<AdviceDto[]> {
    return await this.adviceService.getAll(skip, take);
  }
}
