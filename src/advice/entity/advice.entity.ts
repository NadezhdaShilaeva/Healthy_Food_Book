import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../recipe/entities/image.entity';

@Entity('advices')
export class Advice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @OneToOne(() => Image, { cascade: true, nullable: true })
  @JoinColumn({ name: 'image_id' })
  image: Image;
}
