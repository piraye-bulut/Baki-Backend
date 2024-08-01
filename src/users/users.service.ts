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
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(firstName: string, lastName: string, email: string, password: string, verificationToken: string): Promise<User> {
    try {
      this.logger.log(`Creating user with email: ${email}`);

      if (!password) {
        throw new Error('Password is required');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.usersRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isVerified: false,
        verificationToken,
      });

      return await this.usersRepository.save(user);
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      throw new Error('Error creating user: ' + error.message);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      this.logger.log(`Finding user by email: ${email}`);
      const user = await this.usersRepository.findOne({ where: { email } });
      this.logger.log(`User found: ${user ? JSON.stringify(user) : 'null'}`);
      return user;
    } catch (error) {
      this.logger.error('Error finding user by email', error.stack);
      throw new Error('Error finding user by email: ' + error.message);
    }
  }

  async findOneById(id: number): Promise<User> {
    try {
      this.logger.log(`Finding user by id: ${id}`);
      const user = await this.usersRepository.findOne({ where: { id } });
      this.logger.log(`User found: ${user ? JSON.stringify(user) : 'null'}`);
      return user;
    } catch (error) {
      this.logger.error('Error finding user by id', error.stack);
      throw new Error('Error finding user by id: ' + error.message);
    }
  }

  async findByVerificationToken(verificationToken: string): Promise<User> {
    this.logger.log(`Finding user by verification token: ${verificationToken}`);
    return this.usersRepository.findOne({ where: { verificationToken } });
  }

  async verifyUser(user: User): Promise<User> {
    try {
      this.logger.log(`Verifying user with email: ${user.email}`);
      user.isVerified = true;
      user.verificationToken = null;
      return await this.usersRepository.save(user);
    } catch (error) {
      this.logger.error('Error verifying user', error.stack);
      throw new Error('Error verifying user: ' + error.message);
    }
  }
}