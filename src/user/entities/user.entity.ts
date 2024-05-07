import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from '../../recipe/entities/recipe.entity';

export enum Role {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  GUEST = 'guest',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.GUEST,
  })
  role: Role;

  @OneToMany(() => Recipe, (recipe) => recipe.author)
  createdRecipes: Recipe[];

  @ManyToMany(() => Recipe)
  @JoinTable({
    name: 'user_recipe',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'recipe_id' },
  })
  favoriteRecipes: Recipe[];
}
