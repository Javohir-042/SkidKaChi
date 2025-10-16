import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';
import bcrypt from 'bcrypt'
import { MailService } from '../mail/mail.service';
import { PhoneUserDto } from './dto/phone-user.dto';

import otpGenerator from 'otp-generator'
import { BotService } from '../bot/bot.service';
import { SmsService } from '../sms/sms.service';
import { AddMinutesToDate } from '../common/helpers/addMinutes';
import { Otp } from './model/otp.model';
import { timestamp } from 'rxjs';
import { decode, encode } from '../common/helpers/crypto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { message } from 'telegraf/filters';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Otp) private readonly otpModel: typeof Otp,

    private readonly mailService: MailService,
    private readonly botService: BotService,
    private readonly smsService: SmsService,
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
    if (!link) {
      throw new BadRequestException("Activation link not found");
    }
    const updatedUser = await this.userModel.update(
      { is_active: true },
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
    const user = await this.userModel.destroy({ where: { id } })
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return {}
  }


  async newOtp(phoneUserDto: PhoneUserDto) {
    const phone_number = phoneUserDto.phone_number

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    // ---------------------- BOT ------------------------------ 
    const isSend = await this.botService.sendOtp(phone_number, otp)
    if (!isSend) {
      throw new BadRequestException("Avval botda ro'yxatdan o'ting");
    }
    // ------------------------------END BOT----------------------

    // ----------------------SMS------------------------------------

    // const response = await this.smsService.sendSMS(phone_number, otp);

    // if (response.status != 200) {
    //   throw new ServiceUnavailableException("OTP yuborishda xatolik")
    // }

    const messageSMS = `OTP code has been send to ****` + phone_number.slice(phone_number.length - 4);

    // --------------------------END SMS---------------------------------------
    const now = new Date()
    const expiration_time = AddMinutesToDate(now, 5);
    await this.otpModel.destroy({ where: { phone_number } });
    const newOtpData = await this.otpModel.create({
      otp,
      phone_number,
      expiration_time,
    });

    const details = {
      timestamp: now,
      phone_number,
      otp_id: newOtpData.id,
    };
    const encodedData = await encode(JSON.stringify(details));

    return {
      message: "Botga otp yuborildi",
      verification_key: encodedData,
      messageSMS,
    };
  }


  async verifyOtp(VerifyOtpDto: VerifyOtpDto) {
    const { verification_key, phone: phone_number, otp } = VerifyOtpDto;

    const currentDate = new Date()
    const decodedData = await decode(verification_key);
    const details = JSON.parse(decodedData);
    if (details.phone_number != phone_number) {
      throw new BadRequestException("OTP bu  telefon raqamga yuborilmagan");
    }

    const resultOTP = await this.otpModel.findByPk(details.otp_id);

    if (resultOTP == null) {
      throw new BadRequestException("Bunday OTP yo'q")
    }

    if (resultOTP.verified) {
      throw new BadRequestException("Bunday OTP avval tekshirilgan ")
    }

    if (resultOTP.expiration_time < currentDate) {
      throw new BadRequestException("Bunday OTPning vaqti tugagan")
    }

    if (resultOTP.otp != otp) {
      throw new BadRequestException("OTP mos emas")
    }

    const user = await this.userModel.update(
      { is_owner: true },
      {
        where: { phone: phone_number },
        returning: true,
      }
    );

    if (!user[1][0]) {
      throw new BadRequestException("Bunday raqamli foydalanuvchi yo'q");
    }

    await this.otpModel.update(
      { verified: true },
      { where: { id: details.otp_id } }
    );

    return {
      message: "Tabriklayman, siz owner bo'ldingiz"
    }
  }
}
