import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { User } from './entities/user.entity';
import { Role } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserException } from 'src/user/exceptions/user.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createUserGuest(createUserDto: CreateUserDto): Promise<GetUserDto> {
    if (await this.isUserWithEmailExists(createUserDto.email)) {
      throw UserException.userWithEmailAlreadyExists(createUserDto.email);
    }

    const newUser = {
      username: createUserDto.username,
      email: createUserDto.email,
      password: bcrypt.hashSync(createUserDto.password, 10),
      role: Role.GUEST,
    };

    return await this.userRepository.save(newUser);
  }

  async createUserModerator(createUserDto: CreateUserDto): Promise<GetUserDto> {
    if (await this.isUserWithEmailExists(createUserDto.email)) {
      throw UserException.userWithEmailAlreadyExists(createUserDto.email);
    }

    const newUser = {
      username: createUserDto.username,
      email: createUserDto.email,
      password: bcrypt.hashSync(createUserDto.password, 10),
      role: Role.MODERATOR,
    };

    return await this.userRepository.save(newUser);
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async getUserById(id: number): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw UserException.userNotFoundException(id);
    }

    return user;
  }

  async getModerators(): Promise<GetUserDto[]> {
    const moderators = await this.userRepository.findBy({
      role: Role.MODERATOR,
    });

    return moderators;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(userId);

    if (!user) {
      throw UserException.userNotFoundException(userId);
    }

    if (user.email !== updateUserDto.email && await this.isUserWithEmailExists(updateUserDto.email)) {
      throw UserException.userWithEmailAlreadyExists(updateUserDto.email);
    }

    await this.userRepository.update(userId, updateUserDto);
  }

  async delete(userId: number): Promise<void> {
    const user = await this.findUserById(userId);

    if (!user) {
      throw UserException.userNotFoundException(userId);
    }

    await this.userRepository.delete(userId);
  }

  private async isUserWithEmailExists(userEmail: string): Promise<boolean> {
    const users = await this.userRepository.findBy({
      email: userEmail,
    });

    if (users.length) return true;
    
    return false;
  }

  private async findUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId},
    });

    return user;
  }
}
