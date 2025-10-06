import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto } from '../users/dto/signin.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() signinUserDto: SigninUserDto, @Res({passthrough: true}) res: Response){
    return this.authService.signin(signinUserDto, res);
  }
}
