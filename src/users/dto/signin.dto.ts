import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class SigninUserDto {
    @ApiProperty({
        example: 'javohirquromboyev933@gmail.com',
        description: "Foydalanuvchining elektron pochtasi",
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: "Javohir_Quromboyev_042",
        description: 'foydalanuvchi paroli'
    })
    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}