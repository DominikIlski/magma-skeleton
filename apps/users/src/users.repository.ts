import { AbstractMongoDbRepository } from '@app/common';
import { User } from './schemas/user.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class UserRepository extends AbstractMongoDbRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectModel(User.name) userModel: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }
}
