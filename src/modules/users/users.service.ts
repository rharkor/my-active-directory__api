import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import User from './entities/user.entity';
import { CreateUserDto } from './dtos/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined,
    withPassword = false,
  ): Promise<User | null> {
    if (withPassword)
      return this.userRepository.findOne({
        where,
        select: [
          'id',
          'email',
          'username',
          'password',
          'firstName',
          'lastName',
          'metadata',
          'roles',
        ],
      });
    return this.userRepository.findOne({ where });
  }

  async create(user: CreateUserDto): Promise<User> {
    const userObject = this.userRepository.create(user);
    return this.userRepository.save(userObject);
  }
}
