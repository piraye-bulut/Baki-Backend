import { Controller, Post, Body, Logger, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      this.logger.log(`Signup: ${JSON.stringify(createUserDto)}`);
      const user = await this.usersService.create(createUserDto.firstName, createUserDto.lastName, createUserDto.email, createUserDto.password);
      return user;
    } catch (error) {
      this.logger.error('Error during signup process', error.stack);
      throw new InternalServerErrorException('An error occurred during signup');
    }
  }

  @Post('login')
  async login(@Body() body: { email: string, password: string }) {
    try {
      const { email, password } = body;
      this.logger.log(`Login attempt for ${email}`);

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException();
      }

      const validUser = await this.authService.validateUser(email, password);
      if (validUser) {
        return this.authService.login(validUser);
      }
      throw new UnauthorizedException();
    } catch (error) {
      this.logger.error('Error during login process', error.stack);
      throw new InternalServerErrorException('An error occurred during login');
    }
  }
}