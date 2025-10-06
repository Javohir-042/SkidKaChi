import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';
import bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) { }


  async create(createUserDto: CreateUserDto) {
    const { password, confirm_password } = createUserDto;

    if (password !== confirm_password) {
      throw new BadRequestException({ message: "Parollar mos emas" })
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    const newUser = await this.userModel.create({ ...createUserDto, password: hashedPassword });

    return newUser;
  }

  findAll() {
    return this.userModel.findAll();
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id)
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user;
  }


  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
    });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
