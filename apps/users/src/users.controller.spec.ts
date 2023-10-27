import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { Types } from 'mongoose';

const EXAMPLE_USER = {
  _id: new Types.ObjectId('5f1e36e8eaba1c1b68e19569'),
  name: 'John',
  email: 'test@test.pl',
  password: 'password',
  createdAt: new Date(),
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [EXAMPLE_USER];
      jest
        .spyOn(usersService, 'findAll')
        .mockImplementation(() => Promise.resolve(result));

      expect(await usersController.findAll()).toBe(result);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const result = EXAMPLE_USER;
      jest
        .spyOn(usersService, 'findById')
        .mockImplementation(() => Promise.resolve(result));

      expect(await usersController.findById('1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const result = EXAMPLE_USER;
      jest
        .spyOn(usersService, 'create')
        .mockImplementation(() => Promise.resolve(result));

      expect(await usersController.create(EXAMPLE_USER as CreateUserDto)).toBe(
        result,
      );
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const data: UpdateUserDto = { name: 'John' };
      const result = EXAMPLE_USER;
      jest
        .spyOn(usersService, 'update')
        .mockImplementation(() => Promise.resolve(result));

      expect(await usersController.update('1', data)).toBe(result);
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      const result = true;
      jest
        .spyOn(usersService, 'delete')
        .mockImplementation(() => Promise.resolve(result));

      expect(await usersController.delete('1')).toBe(result);
    });
  });
});
