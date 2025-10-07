import { Body, Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';       // NestJS ichidagi asosiy dekorator
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto } from '../users/dto/signin.dto';
import type { Response } from 'express';
import { CookieGetter } from '../common/decorators/cookie-getter.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Auth - Token olish uchun ")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // signup route - foydalanuvchi ro‘yxatdan o‘tishi
  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  // signin route - foydalanuvchi tizimga kirish
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() signinUserDto: SigninUserDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signin(signinUserDto, res);
  }

  // signOut route - foydalanuvchi tokenni bekor qilish
  @HttpCode(200)
  @Post("signOut")
  signOut(
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signOut(refreshToken, res);
  }

  // refresh route - refresh token bilan yangi token olish
  @HttpCode(200)
  @Post(":id/refresh")
  refresh(
    @Param("id", ParseIntPipe) id: number,                    // Paramdan id olamiz, ParseIntPipe orqali numberga aylantiramiz
    @CookieGetter("refreshToken") refreshToken: string,       // CookieGetter orqali refreshToken olish
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refreshToken(id, refreshToken, res);
  }
}
