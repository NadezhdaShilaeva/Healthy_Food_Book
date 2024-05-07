import { Module } from '@nestjs/common';
import { AdviceController } from './advice.controller';
import { AdviceService } from './advice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advice } from './entity/advice.entity';
import { Image } from 'src/recipe/entities/image.entity';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Advice, Image]), FileModule],
  controllers: [AdviceController],
  providers: [AdviceService],
  exports: [AdviceService],
})
export class AdviceModule {}
