import { AbstBaseReturnDto } from '@app/common/abstracts';
import { PageOptionsDto } from '../dtos/page_options.dto';

export interface IPageMetaParams extends AbstBaseReturnDto {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}
