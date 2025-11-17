import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

   /**
   * Buscar usuario por email
   */
  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * Buscar usuario por nombre
   */
  findByName(name: string) {
    return this.userRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  /**
   * Buscar por nombre O email
   */
  search(query: string) {
    return this.userRepository.find({
      where: [
        { name: Like(`%${query}%`) },
        { email: Like(`%${query}%`) },
      ],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}