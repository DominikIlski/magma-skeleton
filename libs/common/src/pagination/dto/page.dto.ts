import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IPageDto } from '../interfaces';
import { PageMetaDto } from './page_meta.dto';
import { IBaseDto } from '@app/common/interfaces';

export abstract class AbstractPageDto<T extends IBaseDto>
  implements IPageDto<T>
{
  @ValidateNested()
  @Type(() => PageMetaDto)
  readonly meta: PageMetaDto;

  readonly data: T[];
}
