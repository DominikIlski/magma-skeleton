import { AbstBaseReturnDto } from '@app/common/index';
import { IBaseReturnDto } from '@app/common/interfaces';
import { Exclude } from 'class-transformer';
import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class ReturnUserDto extends AbstBaseReturnDto implements IBaseReturnDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @Exclude()
  readonly password: string;
}
