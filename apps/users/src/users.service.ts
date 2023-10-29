import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { PageOptionsDto } from '@app/common/pagination';
import { RetrunAllUsers } from './dto/return_all_users.dto';
import { ReturnUserDto } from './dto/return_user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(pageOptionsDto: PageOptionsDto): Promise<RetrunAllUsers> {
    return this.userRepository.getAllWithPagination(pageOptionsDto);
  }

  async findById(id: string): Promise<ReturnUserDto> {
    const userEntity = await this.userRepository.findById(id);
    return plainToInstance(ReturnUserDto, userEntity);
  }

  async create(userDto: CreateUserDto): Promise<ReturnUserDto> {
    const existingUser = await this.userRepository.findByEmail(userDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const userEntity = await this.userRepository.create(userDto);
    return plainToInstance(ReturnUserDto, userEntity);
  }

  async update(id: string, user: UpdateUserDto): Promise<ReturnUserDto> {
    const userEntity = await this.userRepository.update(id, user);
    return plainToInstance(ReturnUserDto, userEntity);
  }

  async delete(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
