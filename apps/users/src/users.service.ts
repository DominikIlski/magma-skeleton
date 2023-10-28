import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async create(user: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    return this.userRepository.create(user);
  }

  async update(id: string, user: UpdateUserDto): Promise<User | null> {
    return this.userRepository.update(id, user);
  }

  async delete(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
