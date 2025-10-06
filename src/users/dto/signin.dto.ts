import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class SigninUserDto {
    @ApiProperty({
        example: 'javohir123@gmail.com',
        description: "Foydalanuvchining elektron pochtasi",
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: "Javohir123!",
        description: 'foydalanuvchi paroli'
    })
    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}