import { IPageMetaDto } from './page_meta.interface';

export interface IPageDto<T> {
  data: T[];
  readonly meta: IPageMetaDto;
}
