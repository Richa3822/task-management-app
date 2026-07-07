import {
    ConflictException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { UsersService } from '../users/users.service';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  
  const SALT_ROUNDS = 10;
  
  @Injectable()
  export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
    ) {}
  
    async register(dto: RegisterDto) {
      const existingUser = await this.usersService.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
  
      const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
      const user = await this.usersService.create(
        dto.email,
        hashedPassword,
        dto.name,
      );
  
      return this.buildTokenResponse(user._id.toString(), user.email, user.name);
    }
  
    async login(dto: LoginDto) {
      const user = await this.usersService.findByEmail(dto.email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      return this.buildTokenResponse(user._id.toString(), user.email, user.name);
    }
  
    private buildTokenResponse(userId: string, email: string, name: string) {
      const payload = { sub: userId, email };
      const accessToken = this.jwtService.sign(payload);
  
      return {
        accessToken,
        user: { id: userId, email, name },
      };
    }
  }