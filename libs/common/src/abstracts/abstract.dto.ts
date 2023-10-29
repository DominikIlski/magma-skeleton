import { IsString } from 'class-validator';
import { IBaseGetDto as IBaseReturnDto } from '../interfaces/interface.dto';
import { Transform } from 'class-transformer';
export abstract class AbstBaseReturnDto implements IBaseReturnDto {
  @IsString()
  @Transform((params) => {
    return params.obj._id.toString();
  })
  _id: string;

  @IsString()
  createdAt: string;
}
