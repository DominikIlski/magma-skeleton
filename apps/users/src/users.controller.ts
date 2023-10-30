import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { AbstractBaseController } from '@app/common';
import { PageOptionsDto } from '@app/common/pagination';
import { ReturnUserDto } from './dto/return_user.dto';

@Controller('users')
export class UsersController extends AbstractBaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }
  @Get()
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.usersService.findAll(pageOptionsDto);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<ReturnUserDto> {
    return this.usersService.findById(id);
  }

  @Post()
  create(@Body() data: CreateUserDto): Promise<ReturnUserDto> {
    return this.usersService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    this.usersService.delete(id);
  }
}
