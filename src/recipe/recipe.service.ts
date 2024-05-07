import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Inject, Injectable } from '@nestjs/common';
import { RecipeCardDto } from './dto/recipe-card.dto';
import { GetRecipeDto } from './dto/get-recipe.dto';
import { Category, Recipe, StateType } from './entities/recipe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, ILike, In, LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Ingredient, MeasurementType } from './entities/ingredient.entity';
import { CookingStep } from './entities/cooking-step.entity';
import { Image } from './entities/image.entity';
import { RecipeException } from 'src/recipe/exceptions/recipe.exception';
import { UserException } from 'src/user/exceptions/user.exception';
import { MFile } from 'src/file/mfile.class';
import { FileService } from 'src/file/file.service';
import { join } from 'path';
import { IngredientDto } from './dto/ingredient.dto';
import { CookingStepDto } from './dto/cooking-step.dto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(CookingStep)
    private readonly cookingStepRepository: Repository<CookingStep>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(FileService)
    private readonly fileService: FileService
  ) {}

  private readonly IMAGE_FOLDER: string = "recipes-img";
  private readonly DEFAULT_DISH_NAME: string = "default-dish.png";

  async create(
    userId: number,
    createRecipeDto: CreateRecipeDto,
    imageFile: MFile
  ): Promise<number> {
    const author = await this.findUserById(userId);
    
    if (!author) {
      throw UserException.userNotFoundException(userId);
    }

    let image;

    if(imageFile) {
      const imgPath = await this.fileService.createFile(imageFile, this.IMAGE_FOLDER);
      image = await this.imageRepository.save({ 
        path: imgPath,
      });
    } else {
      image = await this.getDefaultImage();
    }

    const recipe = await this.recipeRepository.save({
      name: createRecipeDto.name,
      category: createRecipeDto.category as Category,
      hours: createRecipeDto.hours,
      minutes: createRecipeDto.minutes,
      portions: createRecipeDto.portions,
      image: image,
      author: author,
      likes: 0,
      state: StateType.CREATED,
    });

    return recipe.id;
  }

  async addIngredient(
    recipeId: number,
    ingredientDto: IngredientDto
  ): Promise<void> {
    const recipe = await this.findRecipeById(recipeId);
    
    if (!recipe) {
      throw RecipeException.recipeNotExists(recipeId);
    }

    if (recipe.state === StateType.APPROVED) {
      throw RecipeException.recipeAlreadyApproved(recipeId);
    }

    const newIngredient = await this.ingredientRepository.save({
      name: ingredientDto.name,
      amount: ingredientDto.amount,
      measurement: ingredientDto.measurement as MeasurementType,
      recipe: recipe,
    });

    await this.recipeRepository.update(recipeId, recipe);
  }

  async removeIngredient(
    recipeId: number,
    ingredientDto: IngredientDto
  ): Promise<void> {
    const ingredient = await this.ingredientRepository.findOne({
      where: {
        recipe: {
          id: recipeId,
        },
        name: ingredientDto.name,
        amount: ingredientDto.amount,
        measurement: ingredientDto.measurement as MeasurementType,
      },
      relations: {
        recipe: true,
      },
    });

    if (!ingredient) {
      throw RecipeException.ingredientNotExists(ingredientDto.name, ingredientDto.amount, ingredientDto.measurement);
    }

    if (ingredient.recipe.state === StateType.APPROVED) {
      throw RecipeException.recipeAlreadyApproved(recipeId);
    }

    await this.ingredientRepository.delete(ingredient);
  }

  async addCookingStep(
    recipeId: number,
    cookingStepDto: CookingStepDto
  ): Promise<void> {
    const recipe = await this.findRecipeById(recipeId);
    
    if (!recipe) {
      throw RecipeException.recipeNotExists(recipeId);
    }

    if (recipe.state === StateType.APPROVED) {
      throw RecipeException.recipeAlreadyApproved(recipeId);
    }

    const step = await this.cookingStepRepository.findOne({
      where: {
        recipe: {
          id: recipeId,
        },
        number: cookingStepDto.number,
      },
    });

    if (step) {
      step.description = cookingStepDto.description;
      await this.cookingStepRepository.update(step.id, step);

      return;
    }

    const newCookingStep = await this.cookingStepRepository.save({
      number: cookingStepDto.number,
      description: cookingStepDto.description,
      recipe: recipe,
    });

    await this.recipeRepository.update(recipeId, recipe);
  }

  async removeCookingStep(
    recipeId: number,
    cookingStepDto: CookingStepDto
  ): Promise<void> {
    const cookingStep = await this.cookingStepRepository.findOne({
      where: {
        recipe: {
          id: recipeId,
        },
        number: cookingStepDto.number,
      },
      relations: {
        recipe: true,
      },
    });

    if (!cookingStep) {
      throw RecipeException.cookingStepNotExists(cookingStepDto.number);
    }

    if (cookingStep.recipe.state === StateType.APPROVED) {
      throw RecipeException.recipeAlreadyApproved(recipeId);
    }

    await this.cookingStepRepository.delete(cookingStep);
  }

  async getApprovedRecipes(skip: number, take: number, userId: number): Promise<RecipeCardDto[]> {
    const recipes = await this.recipeRepository.find({
      where: {
        state: StateType.APPROVED,
      },
      relations: {
        image: true,
      },
      order: {
        likes: "DESC",
      },
      skip: skip,
      take: take,
    });

    const favouriteRecipes = userId ? (await this.getFavouriteRecipesByUserId(userId))
                                        .map(recipe => recipe.id) : [];

    return recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image,
        name: recipe.name,
        category: recipe.category,
        hours: recipe.hours,
        minutes: recipe.minutes,
        state: recipe.state,
        likes: recipe.likes,
        isLiked: favouriteRecipes.includes(recipe.id),
      }
    });
  }

  async getCreatedRecipes(userId: number): Promise<RecipeCardDto[]> {
    const recipes = await this.recipeRepository.find({
      relations: {
        image: true,
      },
      where: {
        state: StateType.CREATED,
      },
      order: {
        id: "DESC",
      },
    });

    const favouriteRecipes = userId ? (await this.getFavouriteRecipesByUserId(userId))
                                        .map(recipe => recipe.id) : [];

    return recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image,
        name: recipe.name,
        category: recipe.category,
        hours: recipe.hours,
        minutes: recipe.minutes,
        state: recipe.state,
        likes: recipe.likes,
        isLiked: favouriteRecipes.includes(recipe.id),
      }
    });
  }

  async getRecipeById(id: number, userId: number): Promise<GetRecipeDto> {
    const recipe = await this.recipeRepository.findOne({
      relations: {
        author: true,
        image: true,
        ingredients: true,
        cookingSteps: true,
      },
      where: {
        id: id,
      },
    });

    if (!recipe) {
      throw RecipeException.recipeNotExists(id);
    }    

    const favouriteRecipes = userId ? (await this.getFavouriteRecipesByUserId(userId))
                                                .map(recipe => recipe.id) : [];

    return {
        id: recipe.id,
        image: recipe.image,
        name: recipe.name,
        author: recipe.author,
        category: recipe.category,
        hours: recipe.hours,
        minutes: recipe.minutes,
        portions: recipe.portions,
        ingredients: recipe.ingredients,
        cookingSteps: recipe.cookingSteps,
        likes: recipe.likes,
        isLiked: favouriteRecipes.includes(recipe.id),
    };
  }

  async getRecipesByName(name: string, skip: number, take: number, userId: number): Promise<RecipeCardDto[]> {
    const recipes = await this.recipeRepository.find({
      relations: {
        image: true,
      },
      where: {
        name: ILike(`%${name}%`),
        state: StateType.APPROVED,
      },
      order: {
        likes: "DESC",
      },
      skip: skip,
      take: take,
    });

    const favouriteRecipes = userId ? (await this.getFavouriteRecipesByUserId(userId))
                                        .map(recipe => recipe.id) : [];

    return recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image,
        name: recipe.name,
        category: recipe.category,
        hours: recipe.hours,
        minutes: recipe.minutes,
        state: recipe.state,
        likes: recipe.likes,
        isLiked: favouriteRecipes.includes(recipe.id),
      }
    });
  }

  async getRecipesByCategory(category: string, skip: number, take: number, userId: number): Promise<RecipeCardDto[]> {
    const recipes = await this.recipeRepository.find({
      where: {
        category: category as Category,
        state: StateType.APPROVED,
      },
      relations: {
        image: true,
      },
      order: {
        likes: "DESC",
      },
      skip: skip,
      take: take,
    });

    const favouriteRecipes = userId ? (await this.getFavouriteRecipesByUserId(userId))
                                        .map(recipe => recipe.id) : [];

    return recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image,
        name: recipe.name,
        category: recipe.category,
        hours: recipe.hours,
        minutes: recipe.minutes,
        state: recipe.state,
        likes: recipe.likes,
        isLiked: favouriteRecipes.includes(recipe.id),
      }
    });
  }

  async getRecipesByCategoryAndIngredientsAndMaxTime(
    category: string,
    ingredients: string[],
    minutes: number,
    skip: number,
    take: number,
    userId: number
  ): Promise<RecipeCardDto[]> {
    const mins = minutes % 60;
    const hours = (minutes - mins) / 60;

    let recipes;

    if (category === "any" && !ingredients) {
      recipes = await this.recipeRepository.find({
        relations: {
          image: true,
        },
        where: [
          {
            hours: LessThan(hours),
            state: StateType.APPROVED,
          },
          {
            hours: hours,
            minutes: LessThanOrEqual(mins),
            state: StateType.APPROVED,
          }
        ],
        order: {
          likes: "DESC",
        },
        skip: skip,
        take: take,
      });
    } else if (!ingredients) {
      recipes = await this.recipeRepository.find({
        relations: {
          image: true,
        },
        where: [
          {
            category: category as Category,
            hours: LessThan(hours),
            state: StateType.APPROVED,
          },
          {
            category: category as Category,
            hours: hours,
            minutes: LessThanOrEqual(mins),
            state: StateType.APPROVED,
          }
        ],
        order: {
          likes: "DESC",
        },
        skip: skip,
        take: take,
      });
    } else if (category === "any") {
      recipes = await this.recipeRepository.find({
        relations: {
          image: true,
        },
        where: [
          {
            ingredients: {
              name: In(ingredients),
            },
            hours: LessThan(hours),
            state: StateType.APPROVED,
          },
          {
            ingredients: {
              name: In(ingredients),
            },
            hours: hours,
            minutes: LessThanOrEqual(mins),
            state: StateType.APPROVED,
          }
        ],
        order: {
          likes: "DESC",
        },
        skip: skip,
        take: take,
      });
    } else {
      recipes = await this.recipeRepository.find({
        relations: {
          image: true,
        },
        where: [
          {
            ingredients: {
              name: In(ingredients),
            },
            category: category as Category,
            hours: LessThan(hours),
            state: StateType.APPROVED,
          },
          {
            ingredients: {
              name: In(ingredients),
            },
            category: category as Category,
            hours: hours,
            minutes: LessThanOrEqual(mins),
            state: StateType.APPROVED,
          }
        ],
        order: {
          likes: "DESC",
        },
        skip: skip,
        take: take,
      });
    }

    const favouriteRecipes = userId ? (await this.getFavouriteRecipesByUserId(userId))
                                        .map(recipe => recipe.id) : [];

    return recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image,
        name: recipe.name,
        category: recipe.category,
        hours: recipe.hours,
        minutes: recipe.minutes,
        state: recipe.state,
        likes: recipe.likes,
        isLiked: favouriteRecipes.includes(recipe.id),
      }
    });
  }

  async getRecipesByAuthor(authorId: number, userId: number): Promise<RecipeCardDto[]> {
    const user = await this.userRepository.findOne({
      where: {
        id: authorId,
      },
      relations: {
        createdRecipes: {
          image: true,
        },
      },
    });
    
    if (!user) {
      throw UserException.userNotFoundException(authorId);
    }

    const favouriteRecipes = userId ? (await this.getFavouriteRecipesByUserId(userId))
                                        .map(recipe => recipe.id) : [];

    return user.createdRecipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image,
        name: recipe.name,
        category: recipe.category,
        hours: recipe.hours,
        minutes: recipe.minutes,
        state: recipe.state,
        likes: recipe.likes,
        isLiked: favouriteRecipes.includes(recipe.id),
      }
    });
  }

  async getFavouriteRecipesByUserId(userId: number): Promise<RecipeCardDto[]> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        favoriteRecipes: {
          image: true,
        },
      },
    });
    
    if (!user) {
      throw UserException.userNotFoundException(userId);
    }

    return user.favoriteRecipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image,
        name: recipe.name,
        category: recipe.category,
        hours: recipe.hours,
        minutes: recipe.minutes,
        state: recipe.state,
        likes: recipe.likes,
        isLiked: true,
      }
    });
  }

  async getFavouriteRecipesByUserIdAndName(
    userId: number,
    name: string,
  ): Promise<RecipeCardDto[]> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        favoriteRecipes: {
          image: true,
        },
      },
    });

    if (!user) {
      throw UserException.userNotFoundException(userId);
    }

    return user.favoriteRecipes.filter(recipe => 
      recipe.name.toLowerCase().includes(name.toLowerCase())
    ).map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image,
        name: recipe.name,
        category: recipe.category,
        hours: recipe.hours,
        minutes: recipe.minutes,
        state: recipe.state,
        likes: recipe.likes,
        isLiked: true,
      }
    });
  }

  async getFavouriteRecipesByUserIdAndCategory(
    userId: number,
    category: string,
  ): Promise<RecipeCardDto[]> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        favoriteRecipes: {
          image: true,
        },
      },
    });

    if (!user) {
      throw UserException.userNotFoundException(userId);
    }

    return user.favoriteRecipes.filter(recipe => 
      recipe.category === category as Category,
    ).map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image,
        name: recipe.name,
        category: recipe.category,
        hours: recipe.hours,
        minutes: recipe.minutes,
        state: recipe.state,
        likes: recipe.likes,
        isLiked: true,
      }
    });
  }

  async addRecipeToFavouritesOfUserId(
    userId: number,
    recipeId: number,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        favoriteRecipes: true,
      },
    });
    
    if (!user) {
      throw UserException.userNotFoundException(userId);
    }

    const recipe = await this.findRecipeById(recipeId);

    if (!recipe) {
      throw RecipeException.recipeNotExists(recipeId);
    }

    if (user.favoriteRecipes.find(favRecipe => favRecipe.id == recipeId) !== undefined) {
      throw RecipeException.recipeAlreadyInUserFavourites(recipeId, userId);
    }

    if (!user.favoriteRecipes) {
      user.favoriteRecipes = [];
    }

    user.favoriteRecipes.push(recipe);
    recipe.likes++;

    await this.recipeRepository.update(recipeId, recipe);
    await this.userRepository.save(user);
  }

  async removeRecipeFromFavouritesOfUserId(
    userId: number,
    recipeId: number,
  ): Promise<void> {    
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        favoriteRecipes: true,
      },
    });  

    if (!user) {
      throw UserException.userNotFoundException(userId);
    }

    const recipe = await this.findRecipeById(recipeId);

    if (!recipe) {
      throw RecipeException.recipeNotExists(recipeId);
    }

    const recipeIdx = user.favoriteRecipes.findIndex(recipe => recipe.id == recipeId);


    if (recipeIdx == -1) {
      throw RecipeException.recipeNotExitsInUserFavourites(recipeId, userId);
    }

    user.favoriteRecipes.splice(recipeIdx, 1);
    recipe.likes--;

    await this.recipeRepository.update(recipeId, recipe);
    await this.userRepository.save(user);
  }

  async approve(recipeId: number, recipeDto: CreateRecipeDto, imageFile: MFile): Promise<void> {
    const recipe = await this.recipeRepository.findOne({
      where: {
        id: recipeId,
      },
    });

    if (recipe.state === StateType.APPROVED) {
      throw RecipeException.recipeAlreadyApproved(recipeId);
    }

    if(imageFile) {
      await this.fileService.removeFile(recipe.image.path, this.IMAGE_FOLDER);
      await this.imageRepository.delete(recipe.image.id);

      const imgPath = await this.fileService.createFile(imageFile, this.IMAGE_FOLDER);
      const image = await this.imageRepository.save({ 
        path: imgPath,
      });

      recipe.image = image;
    }

    recipe.name = recipeDto.name;
    recipe.category = recipeDto.category as Category;
    recipe.hours = recipeDto.hours;
    recipe.minutes = recipeDto.minutes;
    recipe.portions = recipeDto.portions;
    recipe.state = StateType.APPROVED;

    await this.recipeRepository.update(recipeId, recipe);
  }

  async delete(recipeId: number): Promise<void> {
    const recipe = await this.recipeRepository.findOne({
      where: {
        id: recipeId,
      },
      relations: {
        image: true,
      },
    });

    if (!recipe) {
      throw RecipeException.recipeNotExists(recipeId);
    }

    const path = require('path');
    const imageName = path.basename(recipe.image.path);
    if (imageName !== this.DEFAULT_DISH_NAME) {
      await this.fileService.removeFile(recipe.image.path, this.IMAGE_FOLDER);
    }

    await this.recipeRepository.delete(recipeId);
  }

  private async findRecipeById(recipeId: number) {
    return await this.recipeRepository.findOne({
      where: {id: recipeId},
    });
  }

  private async findUserById(userId: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: userId},
    });
  }

  private async getDefaultImage(): Promise<Image> {
    const imgPath = join("images", this.IMAGE_FOLDER, this.DEFAULT_DISH_NAME);

    const image = await this.imageRepository.save({
      path: imgPath,
    });

    return image;
  }
}
