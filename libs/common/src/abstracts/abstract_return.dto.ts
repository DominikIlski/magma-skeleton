import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { IBaseReturnDto } from '../interfaces';
export abstract class AbstBaseReturnDto implements IBaseReturnDto {
  @IsString()
  @Transform((params) => {
    return params.obj._id.toString();
  })
  _id: string;

  @IsString()
  createdAt: string;
}
