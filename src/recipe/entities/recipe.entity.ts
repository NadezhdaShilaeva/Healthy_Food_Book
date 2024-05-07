import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CookingStep } from './cooking-step.entity';
import { Ingredient } from './ingredient.entity';
import { User } from '../../user/entities/user.entity';
import { Image } from './image.entity';

export enum Category {
  SNACKS = 'snacks',
  SALADS = 'salads',
  SOUPS = 'soups',
  FISH = 'fish',
  MEAT = 'meat',
  GARNISH = 'garnish',
  DESSERTS = 'desserts',
  DRINKS = 'drinks',
  KIDS = 'kids',
}

export enum StateType {
  CREATED = 'created',
  APPROVED = 'approved',
}

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Category,
  })
  category: Category;

  @Column()
  hours: number;

  @Column()
  minutes: number;

  @Column()
  portions: number;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe, { cascade: ['soft-remove'] })
  ingredients: Ingredient[];

  @OneToMany(() => CookingStep, (cookingStep) => cookingStep.recipe, { cascade: ['soft-remove'] })
  cookingSteps: CookingStep[];

  @ManyToOne(() => User, (user) => user.createdRecipes, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToOne(() => Image, { cascade: true, nullable: true })
  @JoinColumn({ name: 'image_id' })
  image: Image;

  @Column({
    type: 'enum',
    enum: StateType,
  })
  state: StateType;

  @Column()
  likes: number;
}
