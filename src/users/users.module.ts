import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { BotModule } from '../bot/bot.module';
import { SmsModule } from '../sms/sms.module';
import { Otp } from './model/otp.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Otp]), MailModule, JwtModule, BotModule, SmsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
