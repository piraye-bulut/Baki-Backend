import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(firstName: string, lastName: string, email: string, password: string): Promise<User> {
    this.logger.log(`Creating user with email: ${email}`);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ firstName, lastName, email, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    this.logger.log(`Finding user by email: ${email}`);
    return this.usersRepository.findOne({ where: { email } });
  }
}