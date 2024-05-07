import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity';

export enum MeasurementType {
  G = 'g',
  KG = 'kg',
  L = 'l',
  ML = 'ml',
  TEAS = 'teas',
  TABLES = 'tables',
  PIECE = 'piece',
  GLASS = 'glass',
}

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({
    type: 'enum',
    enum: MeasurementType,
  })
  measurement: MeasurementType;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
