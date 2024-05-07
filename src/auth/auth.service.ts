import { Injectable } from '@nestjs/common';
import { AuthException } from 'src/auth/exceptions/auth.exception';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './types/user';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
) {}

  async validateUser(email: string, hashedPassword: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
        throw AuthException.userWithEmailAndPasswordNotFound();
    }

    const isPasswordMatching = await bcrypt.compare(
        hashedPassword,
        user.password
    );
    
    if (!isPasswordMatching) {
        throw AuthException.userWithEmailAndPasswordNotFound();
    }

    return user;
  }

  async login(user: IUser) {
    const { id, email } = user;
    const token = this.jwtService.sign({ id: id, email: email });
    
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }
  
  async logout() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}