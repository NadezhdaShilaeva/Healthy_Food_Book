import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Render,
  Req,
  Session,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeCardDto } from './dto/recipe-card.dto';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { IngredientDto } from './dto/ingredient.dto';
import { CookingStepDto } from './dto/cooking-step.dto';
import { LoadTimeInterceptor } from 'src/interceptors/load-time.interceptor';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { UnauthorizedExceptionFilter } from 'src/filters/unauthorized-exception.filter';
import { ForbiddenExceptionFilter } from 'src/filters/forbidden-exception.filter';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types/role';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Recipes')
@Controller('recipes')
@UseFilters(UnauthorizedExceptionFilter, ForbiddenExceptionFilter)
export class RecipeController {
  constructor(
    private readonly recipeService: RecipeService, 
    private readonly userService: UserService
  ) {}


  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile2(@UploadedFile('file') file) {
    console.log(file);
  }

  @ApiOperation({
    summary: 'Create a recipe',
  })
  @ApiConsumes('multipart/form-data')
  @ApiCookieAuth()
  @ApiResponse({
    status: 201,
    description: 'The recipe has been successfully created.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can create a recipe.',
  })
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Req() { user },
    @Body() createRecipeDto: CreateRecipeDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<number> {
    return await this.recipeService.create(user.id, createRecipeDto, image);
  }

  @ApiOperation({
    summary: 'Add ingredient to the recipe',
  })
  @ApiCookieAuth()
  @ApiParam({ description: 'id of the recipe', name: 'recipeId', type: 'number' })
  @ApiResponse({
    status: 201,
    description: 'The ingredient has been successfully added to recipe.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can add ingredient to recipe.',
  })
  @Post('add-ingredient/:recipeId')
  @UseGuards(JwtAuthGuard)
  async addIngredient(
    @Param('recipeId') recipeId: number,
    @Body() ingredientDto: IngredientDto
  ): Promise<void> {
    return await this.recipeService.addIngredient(recipeId, ingredientDto);
  }

  @ApiOperation({
    summary: 'Remove ingredient from the recipe',
  })
  @ApiCookieAuth()
  @ApiParam({ description: 'id of the recipe', name: 'recipeId', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The ingredient has been successfully removed from recipe.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can remove ingredient from recipe.',
  })
  @Delete('remove-ingredient/:recipeId')
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeIngredient(
    @Param('recipeId') recipeId: number,
    @Body() ingredientDto: IngredientDto
  ): Promise<void> {
    return await this.recipeService.removeIngredient(recipeId, ingredientDto);
  }

  @ApiOperation({
    summary: 'Add cooking step to the recipe',
  })
  @ApiCookieAuth()
  @ApiParam({ description: 'id of the recipe', name: 'recipeId', type: 'number' })
  @ApiResponse({
    status: 201,
    description: 'The cooking step has been successfully added to recipe.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can add cooking step to recipe.',
  })
  @Post('add-cooking-step/:recipeId')
  @UseGuards(JwtAuthGuard)
  async addCookingStep(
    @Param('recipeId') recipeId: number,
    @Body() cookingStepDto: CookingStepDto
  ): Promise<void> {
    return await this.recipeService.addCookingStep(recipeId, cookingStepDto);
  }

  @ApiOperation({
    summary: 'Remove cooking step from the recipe',
  })
  @ApiCookieAuth()
  @ApiParam({ description: 'id of the recipe', name: 'recipeId', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The cooking step has been successfully removed from recipe.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can remove cooking step from recipe.',
  })
  @Delete('remove-cooking-step/:recipeId')
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeCookingStep(
    @Param('recipeId') recipeId: number,
    @Body() cookingStepDto: CookingStepDto
  ): Promise<void> {
    return await this.recipeService.removeCookingStep(recipeId, cookingStepDto);
  }

  @ApiOperation({
    summary: 'Find a recipe by id',
  })
  @ApiParam({ description: 'id of the recipe', name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The recipe has been successfully found.',
  })
  @ApiResponse({
    status: 500,
    description: 'The recipe with the id does not exist.',
  })
  @Get('recipe/:id')
  @Render('recipe')
  @UseInterceptors(LoadTimeInterceptor)
  async findOne(@Req() req, @Param('id') id: number) {    
    req.session.curPath = req.path;

    return {
      user: req.session.user ? await this.userService.getUserById(req.session.user.id) : null, 
      recipe: await this.recipeService.getRecipeById(id, req.session.user ? req.session.user.id : null) 
    };
  }

  @ApiOperation({
    summary: 'Find a recipe for moderation by id',
  })
  @ApiCookieAuth()
  @ApiParam({ description: 'id of the recipe', name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The recipe has been successfully found.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Only admin and moderators can moderate the recipe.',
  })
  @ApiResponse({
    status: 500,
    description: 'The recipe with the id does not exist.',
  })
  @Get('recipe-moderation/:id')
  @UseGuards(JwtAuthGuard)
  @Render('recipe_moderation')
  @UseInterceptors(LoadTimeInterceptor)
  async findCreatedOne(@Req() { user }, @Param('id') id: number) {
    return { user: user, recipe: await this.recipeService.getRecipeById(id, user.id) };
  }

  @ApiOperation({
    summary: 'Find recipes created by users but not approved by moderators yet',
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Created recipes have been successfully found.',
    type: RecipeCardDto,
    isArray: true,
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Only admin and moderators can view the list of created recipes.',
  })
  @Get('created')
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Render('recipes_review')
  @UseInterceptors(LoadTimeInterceptor)
  async findCreatedRecipes(@Req() { user }) {
    return { user: user, recipes: await this.recipeService.getCreatedRecipes(user.id) };
  }

  @ApiOperation({
    summary: 'Find recipes approved by moderators',
  })
  @ApiQuery({ name: 'skip', type: 'number'})
  @ApiQuery({ name: 'take', type: 'number'})
  @ApiResponse({
    status: 200,
    description: 'Approved recipes have been successfully found.',
    type: RecipeCardDto,
    isArray: true,
  })
  @Get('approved')
  async findApprovedRecipes(
    @Session() session,
    @Query('skip') skip: number,
    @Query('take') take: number
  ): Promise<RecipeCardDto[]> {
    return await this.recipeService.getApprovedRecipes(
      skip, 
      take, 
      session.user ? session.user.id : null
    );
  }

  @ApiOperation({
    summary: 'Find approved recipes by name',
  })
  @ApiQuery({ name: 'name', type: 'string' })
  @ApiQuery({ name: 'skip', type: 'number'})
  @ApiQuery({ name: 'take', type: 'number'})
  @ApiResponse({
    status: 200,
    description:
      'Approved recipes with such name have been successfully found.',
    type: RecipeCardDto,
    isArray: true,
  })
  @Get('find-by-name')
  async findRecipesByName(
    @Session() session,
    @Query('name') name: string,
    @Query('skip') skip: number,
    @Query('take') take: number
  ): Promise<RecipeCardDto[]> {
    return await this.recipeService.getRecipesByName(
      name, 
      skip, 
      take, 
      session.user ? session.user.id : null
    );
  }

  @ApiOperation({
    summary: 'Find approved recipes by category',
  })
  @ApiQuery({ name: 'category', type: 'string' })
  @ApiQuery({ name: 'skip', type: 'number'})
  @ApiQuery({ name: 'take', type: 'number'})
  @ApiResponse({
    status: 200,
    description:
      'Approved recipes with such category have been successfully found.',
    type: RecipeCardDto,
    isArray: true,
  })
  @Get('find-by-category')
  async findRecipesByCategory(
    @Session() session,
    @Query('category') category: string,
    @Query('skip') skip: number,
    @Query('take') take: number
  ): Promise<RecipeCardDto[]> {
    return await this.recipeService.getRecipesByCategory(
      category, 
      skip, 
      take, 
      session.user ? session.user.id : null
    );
  }

  @ApiOperation({
    summary:
      'Find approved recipes by category, by ingredients and max time of cooking',
  })
  @ApiQuery({ name: 'category', type: 'string' })
  @ApiQuery({ name: 'min', type: 'number' })
  @ApiQuery({ name: 'ingredient', type: 'string[]' })
  @ApiQuery({ name: 'skip', type: 'number'})
  @ApiQuery({ name: 'take', type: 'number'})
  @ApiResponse({
    status: 200,
    description:
      'Approved recipes with such category, ingredients and max time of cooking have been successfully found.',
    type: RecipeCardDto,
    isArray: true,
  })
  @Get('find-by-category-ingredients-time')
  async findRecipesByCategoryAndIngredientsAndMaxTime(
    @Session() session,
    @Query('category') category: string,
    @Query('min') minutes: number,
    @Query('ingredient') ingredients: string[],
    @Query('skip') skip: number,
    @Query('take') take: number
  ): Promise<RecipeCardDto[]> {
    return await this.recipeService.getRecipesByCategoryAndIngredientsAndMaxTime(
      category,
      ingredients,
      minutes,
      skip,
      take,
      session.user ? session.user.id : null
    );
  }

  @ApiOperation({
    summary: 'Find recipes by author - the user who created these recipes',
  })
  @ApiCookieAuth()
  @ApiParam({description: 'id of the recipe author', name: 'authorId', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Created recipes have been successfully found.',
    type: RecipeCardDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can find theirs own recipes.',
  })
  @ApiResponse({
    status: 500,
    description: 'User with such id does not exists.',
  })
  @Get('find-by-author/:authorId')
  @UseGuards(JwtAuthGuard)
  async findRecipesByAuthor(
    @Session() session,
    @Param('authorId') authorId: number,
  ): Promise<RecipeCardDto[]> {
    return await this.recipeService.getRecipesByAuthor(
      authorId, 
      session.user ? session.user.id : null
    );
  }

  @ApiOperation({
    summary: "Find the user's favorite recipes",
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: "Favourite user's recipes have been successfully found.",
    type: RecipeCardDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can find theirs favourite recipes.',
  })
  @Get('favourites')
  @UseGuards(JwtAuthGuard)
  @Render('my_recipes')
  @UseInterceptors(LoadTimeInterceptor)
  async findFavouritesRecipesByUserId(
    @Req() { user },
  ) {
    return {
      user: user,
      recipes: await this.recipeService.getFavouriteRecipesByUserId(user.id) };
  }

  @ApiOperation({
    summary: "Find the user's favorite recipes by recipe name",
  })
  @ApiCookieAuth()
  @ApiQuery({ name: 'name', type: 'string' })
  @ApiResponse({
    status: 200,
    description:
      "Favourite user's recipes with such name have been successfully found.",
    type: RecipeCardDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can find their favourite recipes.',
  })
  @Get('favourites-by-name')
  @UseGuards(JwtAuthGuard)
  async findFavouriteRecipesByUserIdAndName(
    @Req() { user },
    @Query('name') name: string,
  ) {
    return {
      recipes: await this.recipeService.getFavouriteRecipesByUserIdAndName(user.id, name) 
    };
  }

  @ApiOperation({
    summary: "Find the user's favorite recipes by recipe category",
  })
  @ApiCookieAuth()
  @ApiQuery({ name: 'category', type: 'string' })
  @ApiResponse({
    status: 200,
    description:
      "Favourite user's recipes with such category have been successfully found.",
    type: RecipeCardDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can find their favourite recipes.',
  })
  @Get('favourites-by-category')
  @UseGuards(JwtAuthGuard)
  async findFavouriteRecipesByUserIdAndCategory(
    @Req() { user },
    @Query('category') category: string,
  ) {
    return {
      recipes: await this.recipeService.getFavouriteRecipesByUserIdAndCategory(
      user.id,
      category
    ) };
  }

  @ApiOperation({
    summary: 'Add recipe with recipeId to favorite recipes of user with userId',
  })
  @ApiCookieAuth()
  @ApiQuery({ name: 'recipeId', type: 'number' })
  @ApiResponse({
    status: 201,
    description:
      'Recipe with recipeId has been successfully added to favorite recipes of user with userId',
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can add recipe to theirs favourite recipes.',
  })
  @ApiResponse({
    status: 500,
    description: 'User with such id does not exists.',
  })
  @ApiResponse({
    status: 500,
    description: 'Recipe with such id does not exists.',
  })
  @Post('add-to-favourites')
  @UseGuards(JwtAuthGuard)
  async addRecipeToFavouritesOfUserId(
    @Req() { user },
    @Query('recipeId') recipeId: number,
  ): Promise<void> {
    return await this.recipeService.addRecipeToFavouritesOfUserId(
      user.id,
      recipeId,
    );
  }

  @ApiOperation({
    summary:
      'Remove recipe with recipeId from favorite recipes of user with userId',
  })
  @ApiCookieAuth()
  @ApiQuery({ name: 'recipeId', type: 'number' })
  @ApiResponse({
    status: 201,
    description:
      'Recipe with recipeId has been successfully removed to favorite recipes of user with userId',
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authorized. Only authenticated users can remove recipe from theirs favourite recipes.',
  })
  @ApiResponse({
    status: 500,
    description: 'User with such id does not exists.',
  })
  @ApiResponse({
    status: 500,
    description: 'Recipe with such id does not exists.',
  })
  @Post('remove-from-favourites')
  @UseGuards(JwtAuthGuard)
  async removeRecipeFromFavouritesOfUserId(
    @Req() { user },
    @Query('recipeId') recipeId: number,
  ): Promise<void> {
    return await this.recipeService.removeRecipeFromFavouritesOfUserId(
      user.id,
      recipeId,
    );
  }

  @ApiOperation({
    summary: 'Update the recipe by id and approved the recipe',
  })
  @ApiConsumes('multipart/form-data')
  @ApiCookieAuth()
  @ApiParam({description: 'id of the recipe', name: 'id', type: 'number' })
  @ApiResponse({
    status: 201,
    description: 'The recipes with such id have been successfully updated.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Only moderators can update recipes created by users.',
  })
  @Patch('approve/:id')
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  async approve(
    @Param('id') id: number,
    @Body() recipeDto: CreateRecipeDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<void> {
    return await this.recipeService.approve(id, recipeDto, image);
  }

  @ApiOperation({
    summary: 'Remove the recipe by id',
  })
  @ApiCookieAuth()
  @ApiParam({ description: 'id of the recipe', name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The recipes with such id have been successfully removed.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Only admin and moderators can remove recipes created by users.',
  })
  @Delete('remove/:id')
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: number): Promise<void> {
    return await this.recipeService.delete(id);
  }
}
