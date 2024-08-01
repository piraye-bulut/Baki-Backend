import {Controller,Post,Body,Logger,UsePipes,ValidationPipe,ValidationError,BadRequestException,InternalServerErrorException,UnauthorizedException,Get,Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('signup')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = validationErrors.map((error) => ({
          property: error.property,
          constraints: Object.values(error.constraints),
        }));
        return new BadRequestException(errors);
      },
    }),
  )
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      this.logger.log(`Signup: ${JSON.stringify(createUserDto)}`);

      const existingUser = await this.usersService.findByEmail(createUserDto.email);
      if (existingUser) {
        this.logger.error('User already exists');
        throw new BadRequestException([{ property: 'email', constraints: ['User already exists'] }]);
      }

      const verificationToken = uuidv4();

      const user = await this.usersService.create(
        createUserDto.firstName,
        createUserDto.lastName,
        createUserDto.email,
        createUserDto.password,
        verificationToken,
      );

      this.logger.log(`Sending verification email to: ${createUserDto.email}`);
      await this.mailService.sendConfirmationEmail(user.email, user.verificationToken);

      return { message: 'User registered. Please check your email for verification link.' };
    } catch (error) {
      this.logger.error('Error during signup process', error.stack);
      throw new InternalServerErrorException('An error occurred during signup');
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const { email, password } = body;
      this.logger.log(`Login attempt for ${email}`);

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isVerified) {
        throw new UnauthorizedException('Email not verified');
      }

      const validUser = await this.authService.validateUser(email, password);
      if (validUser) {
        return this.authService.login(validUser);
      }
      throw new UnauthorizedException('Invalid credentials');
    } catch (error) {
      this.logger.error('Error during login process', error.stack);
      throw new InternalServerErrorException('An error occurred during login');
    }
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string, @Res() res) {
    try {
      this.logger.log(`Email verification attempt with token: ${token}`);

      const user = await this.usersService.findByVerificationToken(token);

      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).send('Invalid or expired token');
      }

      await this.usersService.verifyUser(user);
      return res.status(HttpStatus.OK).send('Email successfully verified');
    } catch (error) {
      this.logger.error('Error during email verification process', error.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('An error occurred during email verification');
    }
  }
}