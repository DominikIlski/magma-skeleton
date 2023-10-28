import { User } from 'apps/users/src/schemas/user.schema';
import { IRepository } from './interface.repository';

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}
