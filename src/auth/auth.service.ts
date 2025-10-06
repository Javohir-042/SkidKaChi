import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/model/user.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto } from '../users/dto/signin.dto';
import bcrypt from "bcrypt"
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ){}

    private async generateTokens(user: User) {
        const payload = {
            id: user.id,
            email: user.email,
            is_active: user.is_active,
            is_owner: user.is_owner,
        };

        const [accessToken , refreshToken] = await Promise.all([
            this.jwtService.sign(payload, {
                secret: process.env.ACCESS_TOKEN_KEY,
                expiresIn: process.env.ACCESS_TOKEN_TIME,
            }),

            this.jwtService.sign(payload, {
                secret: process.env.REFRESH_TOKEN_KEY,
                expiresIn: process.env.REFRESH_TOKEN_TIME
            })
        ]);

        return { accessToken, refreshToken}
    }

    async signup(createUserDto: CreateUserDto) {
        const candidate = await this.userService.findUserByEmail(
            createUserDto.email
        );
        if(candidate) {
            throw new ConflictException("Bunday foydalanuvchi mavjude");
        }

        const newUser = await this.userService.create(createUserDto)
        return newUser;
    }


    async signin(signinUserDto: SigninUserDto, res: Response) {
        const user = await this.userService.findUserByEmail(signinUserDto.email);
        if(!user){
            throw new UnauthorizedException(`Email yoki parol noto'g'ri`);
        }

        const verifyPassword = await bcrypt.compare(
            signinUserDto.password,
            user.password
        );
        if(!verifyPassword){
            throw new UnauthorizedException("Email yoki parol noto'g'ri")
        }

        const { accessToken, refreshToken } = await this.generateTokens(user);

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
        user.refresh_token = hashedRefreshToken;
        await user.save();
        res.cookie('refreshToken', refreshToken, {
            maxAge: Number(process.env.COOKIE_TIME),
            httpOnly: true,
        });

        return this.generateTokens(user);
    }
}
