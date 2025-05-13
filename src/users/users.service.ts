import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const user = this.userRepository.create(createUserDto);
    this.userRepository.save(user);
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByUsername(username: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      const avatar_url = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
      user = this.userRepository.create({ username, avatar_url });
      await this.userRepository.save(user);
    }
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
