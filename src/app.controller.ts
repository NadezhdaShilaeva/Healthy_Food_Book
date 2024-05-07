import { Controller, Get, Render, Req, Session, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LoadTimeInterceptor } from './interceptors/load-time.interceptor';
import { AdviceService } from './advice/advice.service';
import { RecipeService } from './recipe/recipe.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserService } from './user/user.service';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { Role } from './auth/types/role';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filter';
import { ForbiddenExceptionFilter } from './filters/forbidden-exception.filter';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@UseInterceptors(LoadTimeInterceptor)
@Controller()
@UseFilters(UnauthorizedExceptionFilter, ForbiddenExceptionFilter)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly recipeService: RecipeService,
    private readonly adviceService: AdviceService
  ) {}

  @ApiOperation({
    summary: "Get the main page",
  })
  @ApiResponse({
    status: 200,
    description: "The main page have been successfully gotten.",
  })
  @Get('')
  @Render('index')
  async getIndexPage(@Session() session) {
    session.curPath = '/';

    return {
      user: session.user ? await this.userService.getUserById(session.user.id) : null,
      recipes: await this.recipeService.getApprovedRecipes(0, 3, session.user ? session.user.id : null),
      advices: await this.adviceService.getAll(0, 2),
    };
  }

  @ApiOperation({
    summary: "Get the advice addition page",
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: "Advice addition page have been successfully gotten.",
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can add advice.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only admins and moderators can add advice.',
  })
  @Get('/advices/addition')
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Render('advice_addition')
  async getAdviceAdditionPage(@Req() { user }) {
    return { user: user };
  }

  @ApiOperation({
    summary: "Get the recipe addition page",
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: "Recipe addition page have been successfully gotten.",
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can add recipes.',
  })
  @Get('/recipes/addition')
  @UseGuards(JwtAuthGuard)
  @Render('recipe_addition')
  async getRecipeAdditionPage(@Req() { user }) {
    return { user: user };
  }

  @ApiOperation({
    summary: "Get the moderator registration page",
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: "Moderator registration page have been successfully gotten.",
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can register moderators.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Only administrators can register moderators.',
  })
  @Get('/registration/moderator')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Render('moderator_registration')
  async getModeratorRegistrationPage(@Req() { user }) {
    return { user: user };
  }

  @ApiOperation({
    summary: "Get the entrance page",
  })
  @ApiResponse({
    status: 200,
    description: "Entrance page have been successfully gotten.",
  })
  @Get('/entrance')
  @Render('entrance')
  async getEntrancePage() {
    return {};
  }

  @ApiOperation({
    summary: "Get the user's profile page",
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: "User's profile page have been successfully gotten.",
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can get theirs profile .',
  })
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  @Render('profile')
  async getProfilePage(@Req() { user }) {
    const recipes = await this.recipeService.getRecipesByAuthor(user.id, user.id);

    return { user: user, createdRecipes: recipes};
  }
 
  @ApiOperation({
    summary: "Get the user's profile editing page",
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: "User's profile editing page have been successfully gotten.",
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can edit theirs profile.',
  })
  @Get('/profile/edit')
  @UseGuards(JwtAuthGuard)
  @Render('profile_editing')
  async getUserEditPage(@Req() { user }) {
    return { user: user };
  }

  @ApiOperation({
    summary: "Get forbidden error page",
  })
  @ApiResponse({
    status: 200,
    description: "Forbidden error page have been successfully gotten.",
  })
  @Get('/forbidden_error')
  @Render('message')
  async getForbiddenErrorPage(@Session() { user }) {
    return {
      user: user,
      success: false,
      message: "Отказано в доступе!\n К сожалению, вы не обладаете небходимыми правами для доступа к запрашиваемому объекту.. =(",
    }
  }
}
