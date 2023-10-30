import { AbstractMongoDbRepository } from '@app/common';
import { User } from './schemas/user.schema';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PageOptionsDto } from '@app/common/pagination';
import { RetrunAllUsers } from './dto/return_all_users.dto';
import { IUserRepository } from './interfaces/user_repo.interface';
import { plainToInstance } from 'class-transformer';
import { ReturnUserDto } from './dto/return_user.dto';

@Injectable()
export class UserRepository
  extends AbstractMongoDbRepository<User>
  implements IUserRepository
{
  protected readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectModel(User.name) userModel: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const query = this.model.where({ email: email });
      const result = await this.findOne(query);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }
  }

  async getAllWithPagination(
    pageOptionsDto: PageOptionsDto,
  ): Promise<RetrunAllUsers> {
    const { page, take, order, skip } = pageOptionsDto;

    const usersQuery = this.model
      .find({}, {}, { lean: true })
      .sort({ createdAt: order })
      .skip(skip)
      .limit(take);

    const totalCountQuery = this.model.countDocuments();

    const [users, itemCount] = await Promise.all([
      usersQuery.exec(),
      totalCountQuery.exec(),
    ]);

    const pageCount = Math.ceil(itemCount / take);

    const pageMeta = {
      itemCount,
      page,
      pageCount,
      take,
      hasNextPage: page < pageCount,
      hasPreviousPage: page > 1,
    };

    return {
      data: plainToInstance(ReturnUserDto, users),
      meta: pageMeta,
    };
  }
}
