import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
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
    ) { }

    private async generateTokens(user: User) {
        const payload = {
            id: user.id,
            email: user.email,
            is_active: user.is_active,
            is_owner: user.is_owner,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.sign(payload, {
                secret: process.env.ACCESS_TOKEN_KEY,
                expiresIn: process.env.ACCESS_TOKEN_TIME,
            }),

            this.jwtService.sign(payload, {
                secret: process.env.REFRESH_TOKEN_KEY,
                expiresIn: process.env.REFRESH_TOKEN_TIME
            })
        ]);

        return { accessToken, refreshToken }
    }

    async signup(createUserDto: CreateUserDto) {
        const candidate = await this.userService.findUserByEmail(
            createUserDto.email
        );
        console.log(candidate)
        if (candidate) {
            throw new ConflictException("Bunday foydalanuvchi mavjude");
        }

        const newUser = await this.userService.create(createUserDto)
        return newUser;
    }


    async signin(signinUserDto: SigninUserDto, res: Response) {
        const user = await this.userService.findUserByEmail(signinUserDto.email);
        if (!user) {
            throw new UnauthorizedException(`Email yoki parol noto'g'ri`);
        }

        const verifyPassword = await bcrypt.compare(
            signinUserDto.password,
            user.password
        );
        if (!verifyPassword) {
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


    async signOut(refreshToken: string, res: Response) {
        const userData = await this.jwtService.verify(refreshToken, {
            secret: process.env.REFRESH_TOKEN_KEY,
        });

        if (!userData) {
            throw new BadRequestException("User not verified")
        }

        const user = await this.userService.findOne(userData.id)
        if (!user) {
            throw new BadRequestException("Noto'g'ri token yuborildi")
        }

        user.refresh_token = "";
        await user.save();

        res.clearCookie("refreshToken");
        return {
            message: "User logged out successFullly"
        }
    }


    async refreshToken(
        userId: number,
        refresh_token: string,
        res: Response) {
        const decodedToken = await this.jwtService.decode(refresh_token);
        console.log(userId)
        console.log(decodedToken["id"])

        if (userId !== decodedToken["id"]) {
            throw new ForbiddenException(" Ruxsat etilmagan id")
        }

        const user = await this.userService.findOne(userId);

        if(!user || !user.refresh_token){
            throw new ForbiddenException("Ruxsat etilmagan user")
        }

        const tokenMatch = await bcrypt.compare(refresh_token, user.refresh_token);
        if(!tokenMatch){
            throw new ForbiddenException("Forbidden");
        }

        const { accessToken, refreshToken } = await this.generateTokens(user);
        user.refresh_token = await bcrypt.hash(refreshToken, 7);

        await user.save();
        res.cookie("refreshToken", refreshToken, {
            maxAge: Number(process.env.COOKIE_TIME),
            httpOnly: true,
        });

        return {
            message: "User refreshed",
            userId: user.id,
            access_token: accessToken,
        };
    }

}
