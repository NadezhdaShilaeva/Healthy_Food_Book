import { Inject, Injectable } from '@nestjs/common';
import { AdviceDto } from './dto/advice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Advice } from './entity/advice.entity';
import { Repository } from 'typeorm';
import { AdviceException } from 'src/advice/exceptions/advice.exception';
import { FileService } from 'src/file/file.service';
import { MFile } from 'src/file/mfile.class';
import { Image } from 'src/recipe/entities/image.entity';
import { CreateAdviceDto } from './dto/create-advice.dto';

@Injectable()
export class AdviceService {
  constructor(
    @InjectRepository(Advice)
    private readonly adviceRepository: Repository<Advice>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @Inject(FileService)
    private readonly fileService: FileService
  ) {}

  async create(adviceDto: CreateAdviceDto, imageFile: MFile): Promise<AdviceDto> {
    const advices = await this.adviceRepository.findBy({
      description: adviceDto.description,
    });

    if (advices.length) {
      throw AdviceException.adviceWithDescriptionAlreadyExists();
    }

    const imgPath = await this.fileService.createFile(imageFile, "advices-img");
    const image = await this.imageRepository.save({ 
      path: imgPath,
     });

    return await this.adviceRepository.save({
      description: adviceDto.description,
      image: image,
    });
  }

  async getAll(skip: number, take: number): Promise<AdviceDto[]> {
    return await this.adviceRepository.find({      
      relations: {
        image: true,
      },
      order: {
        id: "ASC",
      },
      skip: skip,
      take: take,
    });
  }
}