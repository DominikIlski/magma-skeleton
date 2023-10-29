import { User } from 'apps/users/src/schemas/user.schema';
import { IBaseRepository } from '../../../../libs/common/src/interfaces/interface.repository';
import { AbstractPageDto, PageOptionsDto } from '@app/common/pagination';
import { ReturnUserDto } from '../dto/return_user.dto';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  getAllWithPagination(
    pageOptionsDto: PageOptionsDto,
  ): Promise<AbstractPageDto<ReturnUserDto>>;
}
