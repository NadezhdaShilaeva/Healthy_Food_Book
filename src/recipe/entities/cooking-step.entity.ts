import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('cooking_steps')
export class CookingStep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column()
  description: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.cookingSteps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
