import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {

    @ApiProperty({
        example: 'Javohir Quromboyev',
        description: "Foydalanuvchining to'liq ism-sharifi",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '+998976006787',
        description: "Foydalanuvchining telefon raqami (xalqaro formatda)",
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        example: 'javohirquromboyev933@gmail.com',
        description: "Foydalanuvchining elektron pochtasi",
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'Javohir_Quromboyev_042',
        description: "Foydalanuvchi paroli",
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        example: 'Javohir_Quromboyev_042',
        description: "Parolni tasdiqlash uchun qayta kiriting",
    })
    @IsString()
    @MinLength(6)
    confirm_password: string;

    @ApiProperty({
        example: 'https://t.me/javohir_042',
        description: "Telegram akkaunt havolasi",
    })
    @IsString()
    @IsNotEmpty()
    tg_link: string;

    @ApiPropertyOptional({
        example: 'Toshkent, Chilonzor tumani',
        description: "Foydalanuvchining manzili",
    })
    @IsOptional()
    @IsString()
    location?: string;


    // regionId: number;
    // districtId: number;
}
