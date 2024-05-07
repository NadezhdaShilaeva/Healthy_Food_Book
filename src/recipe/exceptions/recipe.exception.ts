import { BadRequestException, NotFoundException } from "@nestjs/common";

export class RecipeException {
    static recipeNotExists(id: number): NotFoundException {
        return new NotFoundException(`Рецепт с id ${id} не найден.`);
    }

    static ingredientNotExists(name: string, amount: number, measurement: string): NotFoundException {
        return new NotFoundException(`Ингредиент ${name} ${amount} ${measurement} не найден.`);
    }

    static cookingStepNotExists(number: number): NotFoundException {
        return new NotFoundException(`Шаг с порядковым номером ${number} не найден.`);
    }

    static recipeAlreadyApproved(id: number): BadRequestException {
        return new BadRequestException(`Рецепт с id ${id} уже утвержден. Вносить правки больше не допускается.`);
    }

    static recipeAlreadyInUserFavourites(recipeId: number, userId: number): BadRequestException {
        return new BadRequestException(`Рецепт с id ${recipeId} уже есть в избранном у пользователя с id ${userId}.`);
    }

    static recipeNotExitsInUserFavourites(recipeId: number, userId: number): BadRequestException {
        return new BadRequestException(`Рецепта с id ${recipeId} нет в избранном у пользователя с id ${userId}.`);
    }
}
