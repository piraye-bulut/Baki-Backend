import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity'; // User entity'yi import edin

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && !user.isVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    console.log('Backend - Login User:', user); // Kullanıcı bilgilerini logla

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateUserById(id: number): Promise<any> {
    const user: User | null = await this.usersService.findOneById(id);
    if (user) {
      const { password, ...result } = user; // Password'ı dışlayarak user nesnesinin geri kalanını al
      return result;
    }
    return null;
  }
}