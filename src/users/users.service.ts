import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';
import bcrypt from 'bcrypt'
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly mailService: MailService
  ) { }


  async create(createUserDto: CreateUserDto) {
    const { password, confirm_password } = createUserDto;

    if (password !== confirm_password) {
      throw new BadRequestException({ message: "Parollar mos emas" })
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    const newUser = await this.userModel.create({ ...createUserDto, password: hashedPassword });

    try {
      await this.mailService.sendMail(newUser);
    } catch (error) {
      console.log(error)
      throw new ServiceUnavailableException("Emailga yuborishda xatolik");
    }

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

    async activateUser(link: string) {
    if(!link){
      throw new BadRequestException("Activation link not found");
    }
    const updatedUser = await this.userModel.update(
      {is_active: true},
      {
        where: {
          activation_link: link,
          is_active: false,
        },
        returning: true,
      }
    )
    if (!updatedUser[1][0]) {
      throw new NotFoundException("User already activated")
    }
    return {
      message: "User activated successfully",
      is_active: updatedUser[1][0].is_active,
    };
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const user = await this.userModel.destroy({where: {id}})
    if(!user){
      throw new NotFoundException("User not found")
    }
    return {}
  }
}
